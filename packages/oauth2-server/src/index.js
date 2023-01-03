import assert from 'assert'
import path from 'path'

import bodyParser from 'body-parser'
import express from 'express'
import fetch from 'node-fetch'

import { getConfig } from './config'
import { dbAuthSession } from './shared'

// const cors = require('cors')
const Provider = require('oidc-provider')

const app = (db, settings) => {
  assert(settings.SECURE_KEY, 'settings.SECURE_KEY missing')
  assert.equal(
    settings.SECURE_KEY.split(',').length,
    2,
    'settings.SECURE_KEY format invalid'
  )

  const authenticate = async (req) => {
    try {
      const session = dbAuthSession(req.apiGateway.event)
      console.log(session)
      assert(session?.id, 'invalid credentials provided')
      return session.id
    } catch (err) {
      console.log(err)
      return undefined
    }
  }

  const oidc = new Provider(
    `${settings.APP_DOMAIN}/api/oauth`,
    getConfig(db, settings)
  )
  oidc.proxy = true

  // Express docs https://expressjs.com/en/5x/api.html#app.settings.table
  const expressApp = express()
  expressApp.set('trust proxy', true)
  expressApp.set('view engine', 'ejs')
  expressApp.set('views', path.resolve(__dirname, 'views'))

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

        const provider =
          req.apiGateway?.event?.queryStringParameters?.login_provider
        if (prompt.name === 'login') {
          if (provider) {
            const response = await fetch(`${settings.APP_DOMAIN}/api/auth`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                method: 'signup',
                type: provider,
                stateExtraData: uid,
              }),
            }).then((res) => res.json())
            if (!response.url) throw "Error during sign up. Couldn't fetch url."
            return res.redirect(response.url)
          }
          return res.redirect(`${settings.routes.login}?uid=${uid}`)
        }
        // Interaction is not logging in, so we must be authorizing
        return res.redirect(`${settings.routes.authorize}?uid=${uid}`)
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
        const accountId = await authenticate(req)

        if (!accountId) {
          console.log('invalid login attempt')
          // TODO: redirect to signin page with error message
          return res.send({
            redirectTo: `http://localhost/redirect/keyp?error=invalid login attempt`,
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
  expressApp.oidc = oidc
  return expressApp
}

export default app
