import assert from 'assert'

import bodyParser from 'body-parser'
import express from 'express'
import fetch from 'node-fetch'

import { getConfig } from './config'
import { dbAuthSession } from './shared'

// const cors = require('cors')
const Provider = require('oidc-provider')

const app = (db, settings) => {
  const authenticate = async (req) => {
    try {
      const session = dbAuthSession(req.apiGateway.event)
      // console.log(session)
      assert(session?.id, 'invalid credentials provided')
      return session.id
    } catch (err) {
      // console.log(err)
      return undefined
    }
  }

  const oidc = new Provider(settings.ISSUER_URL, getConfig(db, settings))
  oidc.proxy = true

  settings.middlewares && oidc.use(settings.middlewares(oidc))

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
        // console.log('/oauth/interaction/:uid', prompt)
        const client = await oidc.Client.find(params.client_id)
        const provider =
          req.apiGateway?.event?.queryStringParameters?.login_provider
        const clientRedirectUri = details?.params?.redirect_uri;

        if (!client.redirectUris.includes(clientRedirectUri)) {
          throw new Error('redirect_uri did not match any of the registered uris')
        }

        if (prompt.name === 'login') {
          if (provider) {
            const response = await fetch(`${settings.REDWOOD_API_URL}/auth`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                method: 'signup',
                type: provider,
                stateExtraData: uid,
              }),
            }).then((res) => res.json())
            if (!response.url)
              return res.redirect(`${settings.routes.login}?uid=${uid}`) //throw "Error during sign up. Couldn't fetch url."
            return res.redirect(response.url)
          }
          return res.redirect(`${settings.routes.login}?uid=${uid}`)
        }

        // Interaction is not logging in, so we must be authorizing
        let path = `${settings.routes.authorize}?uid=${uid}`
        const missingOIDCScope = prompt.details.missingOIDCScope.filter(
          (scope) => !['openid', 'offline_access'].includes(scope)
        )
        missingOIDCScope && (path += `&scope=${missingOIDCScope}`)
        client.clientName && (path += `&clientName=${client.clientName}`)
        client.logoUri && (path += `&clientLogoUri=${client.logoUri}`)
        client.policyUri && (path += `&clientPolicyUri=${client.policyUri}`)
        client.tosUri && (path += `&clientTosUri=${client.tosUri}`)
        path += `&clientRedirectUri=${encodeURIComponent(clientRedirectUri)}`

        // For more client metadata available see https://github.com/panva/node-oidc-provider/blob/main/lib/consts/client_attributes.js

        return res.redirect(path)
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
        const { prompt, params } = details

        // console.log('/oauth/interaction/:uid/login', prompt)

        assert.strictEqual(prompt.name, 'login')
        // Lookup the client
        const client = await oidc.Client.find(params.client_id)

        // Lookup the user
        const accountId = await authenticate(req)

        if (!accountId) {
          // console.log('invalid login attempt')
          // TODO: redirect to signin page with error message
          return res.send({
            redirectTo: `/redirect/keyp?error=invalid login attempt`,
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
        const newRedirectTo = `/oauth/auth/${newUid}`
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
        const newRedirectTo = `/oauth/auth/${newUid}`
        // console.log(newRedirectTo)
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
