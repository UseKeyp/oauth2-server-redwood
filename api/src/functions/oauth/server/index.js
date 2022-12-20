import assert from 'assert'

import bodyParser from 'body-parser'
import express from 'express'

import htmlSafe from './helpers'

// const cors = require('cors')
const Provider = require('oidc-provider')

const jwks = require('./jwks')

const app = ({ db }) => {
  assert(process.env.SECURE_KEY, 'process.env.SECURE_KEY missing')
  assert.equal(
    process.env.SECURE_KEY.split(',').length,
    2,
    'process.env.SECURE_KEY format invalid'
  )

  const authenticate = async () => {
    try {
      // const account = await getCurrentUser() // context.currentUser

      // Context doesn't seem to be available in packages
      const account = context?.currentUser
      console.log(context)
      console.log('account', account)

      assert(account.id, 'invalid credentials provided')
      return account.id
    } catch (err) {
      return undefined
    }
  }

  const findAccount = async (ctx, id) => {
    const account = await db.user.findUnique({
      where: { id },
      select: { id: true, username: true, email: true },
    })
    console.log('findAccount', account)
    // console.log('id', id)
    // console.log('account', account)
    if (!account) {
      console.log('Account not found', id)
      return undefined
    }

    return {
      accountId: id,
      // and this claims() method would actually query to retrieve the account claims
      async claims() {
        return {
          sub: id,
          email: account.email,
          email_verified: account.email_verified,
        }
      },
    }
  }

  const oidc = new Provider(`${process.env.APP_DOMAIN}/api/oauth`, {
    clients: [
      {
        client_id: '123',
        client_secret: 'somesecret',
        redirect_uris: [
          'https://jwt.io',
          'http://0.0.0.0:3000/redirect/node_oidc',
          'http://0.0.0.0:8910/redirect/node_oidc',
          'http://localhost:8910/redirect/node_oidc',
          'http://0.0.0.0:8910/redirect/oauth2_server_redwood',
          'https://oauth2-client-redwood-eta.vercel.app/redirect/node_oidc',
        ],
      },
    ],
    clientDefaults: {
      grant_types: ['authorization_code'],
      id_token_signed_response_alg: 'RS256',
      response_types: ['code'],
      token_endpoint_auth_method: 'client_secret_post',
    },
    // clientAuthMethods: ['client_secret_post'],
    cookies: { keys: process.env.SECURE_KEY.split(',') },
    jwks,
    ttl: {
      AuthorizationCode: 60,
      DeviceCode: 60,
      IdToken: 60,
      Interaction: 60,
      Session: 60,
      AccessToken: 60,
    },
    findAccount,
    // let's tell oidc-provider you also support the email scope, which will contain email and
    // email_verified claims
    claims: {
      openid: ['sub'],
      email: ['email', 'email_verified'],
    },
    routes: {
      authorization: '/auth',
      backchannel_authentication: '/backchannel',
      jwks: '/jwks',
      revocation: '/token/revocation',
      token: '/token',
      userinfo: '/me',
    },
    interactions: {
      url: async function interactionsUrl(ctx, interaction) {
        return `/oauth/interaction/${interaction.uid}`
      },
    },
    features: {
      // disable the packaged interactions
      devInteractions: { enabled: false },
    },
    renderError: async (ctx, out, error) => {
      console.error('renderError', error)
      ctx.type = 'html'
      ctx.body = `<!DOCTYPE html>
        <head>
          <title>oops! something went wrong</title>
          <style>/* css and html classes omitted for brevity, see lib/helpers/defaults.js */</style>
        </head>
        <body>
          <div>
            <h1>oops! something went wrong</h1>
            ${Object.entries(out)
              .map(
                ([key, value]) =>
                  `<pre><strong>${key}</strong>: ${htmlSafe(value)}</pre>`
              )
              .join('')}
          </div>
        </body>
        </html>`
    },
  })

  oidc.proxy = true
  // oidc.use(async (ctx, next) => {
  //   /** pre-processing
  //    * you may target a specific action here by matching `ctx.path`
  //    */
  //   console.log('pre middleware', ctx.method, ctx.path)
  //   await next()
  //   // console.log('post middleware', ctx.method, ctx.oidc.route)
  // })

  // Express docs https://expressjs.com/en/5x/api.html#app.settings.table
  const expressApp = express()
  expressApp.set('trust proxy', true)

  const parse = bodyParser.urlencoded({ extended: false })

  function setNoCache(req, res, next) {
    res.set('Pragma', 'no-cache')
    res.set('Cache-Control', 'no-cache, no-store')
    next()
  }

  expressApp.get(
    '/oauth/interaction/:uid',
    setNoCache,
    async (req, res, next) => {
      try {
        const details = await oidc.interactionDetails(req, res)
        // eslint-disable-next-line no-console
        const { uid, prompt, params } = details
        console.log('/oauth/interaction/:uid', prompt)
        const client = await oidc.Client.find(params.client_id)
        if (prompt.name === 'login') {
          return res.redirect(`/signin?uid=${uid}`)
        }
        return res.redirect(`/authorize?uid=${uid}`)
      } catch (err) {
        return next(err)
      }
    }
  )

  expressApp.post(
    '/oauth/interaction/:uid/login',
    setNoCache,
    parse,
    async (req, res, next) => {
      try {
        const details = await oidc.interactionDetails(req, res)
        const { uid, prompt, params } = details
        console.log('/oauth/interaction/:uid/login', prompt)
        assert.strictEqual(prompt.name, 'login')
        // Lookup the client
        const client = await oidc.Client.find(params.client_id)

        // Lookup the user
        const accountId = await authenticate()

        if (!accountId) {
          console.log('invalid login attempt')
          // TODO: redirect to signin page with error message
          return res.send({
            redirectTo: `http://localhost/signin?uid=${uid}?error=invalid`,
          })
        }

        const result = {
          login: {
            accountId,
            // acr: string, // acr value for the authentication
            // arm: string[], // amr values for the authentication
            // remember: boolean, // true if provider should use a persistent cookie rather than a session one, defaults to true
            // ts: number, // unix timestamp of the authentication, defaults to now()
          },
        }
        const redirectTo = await oidc.interactionResult(req, res, result, {
          mergeWithLastSubmission: false,
        })

        // NOTE: may be unnecessary to get the new uid
        const newUid = redirectTo.toString().split('/auth/')[1]
        const newRedirectTo = `http://localhost/oauth/auth/${newUid}`
        res.send({ redirectTo: newRedirectTo })
      } catch (err) {
        next(err)
      }
    }
  )

  expressApp.post(
    '/oauth/interaction/:uid/confirm',
    setNoCache,
    parse,
    async (req, res, next) => {
      try {
        const interactionDetails = await oidc.interactionDetails(req, res)
        const {
          prompt: { name, details },
          params,
          session: { accountId },
        } = interactionDetails
        assert.strictEqual(name, 'consent')

        let { grantId } = interactionDetails
        let grant

        if (grantId) {
          // we'll be modifying existing grant in existing session
          grant = await oidc.Grant.find(grantId)
        } else {
          // we're establishing a new grant
          grant = new oidc.Grant({
            accountId,
            clientId: params.client_id,
          })
        }

        if (details.missingOIDCScope) {
          grant.addOIDCScope(details.missingOIDCScope.join(' '))
          // use grant.rejectOIDCScope to reject a subset or the whole thing
        }
        if (details.missingOIDCClaims) {
          grant.addOIDCClaims(details.missingOIDCClaims)
          // use grant.rejectOIDCClaims to reject a subset or the whole thing
        }
        if (details.missingResourceScopes) {
          // eslint-disable-next-line no-restricted-syntax
          for (const [indicator, scopes] of Object.entries(
            details.missingResourceScopes
          )) {
            grant.addResourceScope(indicator, scopes.join(' '))
            // use grant.rejectResourceScope to reject a subset or the whole thing
          }
        }

        grantId = await grant.save()

        const consent = {}
        if (!interactionDetails.grantId) {
          // we don't have to pass grantId to consent, we're just modifying existing one
          consent.grantId = grantId
        }

        const result = { consent }

        const redirectTo = await oidc.interactionResult(req, res, result, {
          mergeWithLastSubmission: false,
        })

        // NOTE: may be unnecessary to get the new uid
        const newUid = redirectTo.toString().split('/auth/')[1]
        const newRedirectTo = `http://localhost/oauth/auth/${newUid}`
        console.log(newRedirectTo)
        res.send({ redirectTo: newRedirectTo })
      } catch (err) {
        next(err)
      }
    }
  )

  expressApp.get(
    '/oauth/interaction/:uid/abort',
    setNoCache,
    async (req, res, next) => {
      try {
        const result = {
          error: 'access_denied',
          error_description: 'End-User aborted interaction',
        }

        const redirectTo = await oidc.interactionResult(req, res, result, {
          mergeWithLastSubmission: false,
        })
        const newUid = redirectTo.toString().split('/auth/')[1]
        res.redirect(`/oauth/auth/${newUid}`)
      } catch (err) {
        next(err)
      }
    }
  )

  // leave the rest of the requests to be handled by oidc-provider, there's a catch all 404 there
  expressApp.use('/oauth', oidc.callback())

  return expressApp
}

export default app
