// see previous example for the things that are not commented

import assert from 'assert'
import path from 'path'

import bodyParser from 'body-parser'
import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
import express from 'express'

import { logger } from 'src/lib/logger'
dotenv.config()

// const cors = require('cors')
const Provider = require('oidc-provider')

const Account = require('./account')
const jwks = require('./jwks')

assert(
  process.env.SECURE_KEY,
  'process.env.SECURE_KEY missing, run `heroku addons:create securekey`'
)
assert.equal(
  process.env.SECURE_KEY.split(',').length,
  2,
  'process.env.SECURE_KEY format invalid'
)

const oidc = new Provider(`${process.env.APP_DOMAIN}/api/oauth`, {
  clients: [
    {
      client_id: '123',
      // client_secret: "node-oidc-secret",
      redirect_uris: [
        'https://jwt.io',
        'http://0.0.0.0:3000/redirect/node_oidc',
        'http://0.0.0.0:8910/redirect/node_oidc',
        'http://localhost:8910/redirect/node_oidc',
        'http://0.0.0.0:8910/redirect/oauth2_server_redwood',
        'https://oauth2-client-redwood-eta.vercel.app/redirect/node_oidc',
      ],
      response_types: ['code'],
      grant_types: ['authorization_code'],
      token_endpoint_auth_method: 'none',
    },
  ],
  cookies: {
    keys: process.env.SECURE_KEY.split(','),
    short: {
      httpOnly: true,
      overwrite: true,
      sameSite: 'none',
    },
    long: {
      httpOnly: true,
      overwrite: true,
      sameSite: 'none',
    },
  },
  jwks,
  // ttl: {
  // AuthorizationCode: 60,
  // DeviceCode: 60,
  // IdToken: 60,
  // Interaction: 60,
  // },
  // oidc-provider only looks up the accounts by their ID when it has to read the claims,
  // passing it our Account model method is sufficient, it should return a Promise that resolves
  // with an object with accountId property and a claims method.
  findAccount: Account.findAccount,

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
  // let's tell oidc-provider where our own interactions will be
  // setting a nested route is just good practice so that users
  // don't run into weird issues with multiple interactions open
  // at a time.
  interactions: {
    url: async function interactionsUrl(ctx, interaction) {
      return `/oauth/interaction/${interaction.uid}`
    },
  },
  features: {
    // disable the packaged interactions
    devInteractions: { enabled: false },
  },
})

oidc.proxy = true
oidc.use(async (ctx, next) => {
  /** pre-processing
   * you may target a specific action here by matching `ctx.path`
   */
  console.log('pre middleware', ctx.method, ctx.path)
  await next()
  // console.log('post middleware', ctx.method, ctx.oidc.route)
})

// Express docs https://expressjs.com/en/5x/api.html#app.settings.table
const expressApp = express()
expressApp.set('trust proxy', true)
// expressApp.set('view engine', 'ejs')
// expressApp.set('views', path.resolve(__dirname, 'views'))
// expressApp.use(
//   cors({
//     origin: ['http://localhost:3000', 'http://localhost:3210'],
//   })
// )

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

      return res.redirect(`/consent?uid=${uid}`)
      // return res.render('interaction', {
      //   client,
      //   uid,
      //   details: prompt.details,
      //   params,
      //   title: 'Authorize',
      // })
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

      // Validate redwood session token

      // Lookup the user
      const accountId = await Account.authenticate(
        req.body.email,
        req.body.password
      )

      if (!accountId) {
        console.log('invalid login attempt')
        // TODO: redirect to signin page with error message
        // eg.  flash: 'Invalid email or password.',
        return
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
      logger.debug('logged in successfully')

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

export default expressApp
