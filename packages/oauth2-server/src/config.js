import assert from 'assert'

import merge from 'deepmerge'

import { findAccount } from './account'
import getAdapter from './adapter'

export const getConfig = (db, settings) => {
  assert(settings.SECURE_KEY, 'settings.SECURE_KEY missing')
  assert(settings.INTROSPECTION_SECRET, 'settings.INTROSPECTION_SECRET missing')
  assert(settings.jwks, 'settings.jwks is required')
  assert(db, 'settings.db is required')

  const adapter = getAdapter(db)
  return merge(
    {
      adapter,
      findAccount: findAccount(db),
      clients: [
        {
          client_id: 'api-server',
          client_secret: settings.INTROSPECTION_SECRET,
          redirect_uris: ['https://nowhere.foo'],
          token_endpoint_auth_method: 'client_secret_post',
        },
      ],
      clientAuthMethods: ['none', 'client_secret_post'],
      clientDefaults: {
        grant_types: ['authorization_code'],
        id_token_signed_response_alg: 'RS256',
        response_types: ['code'],
        token_endpoint_auth_method: 'none',
      },
      scopes: ['openid', 'email'],
      issueRefreshToken: (ctx, client, code) => {
        return (
          client.grantTypeAllowed('refresh_token') &&
          code.scopes.has('offline_access')
        )
      },
      pkce: { require: true, methods: ['S256'] },
      responseTypes: ['code id_token', 'code', 'id_token'],
      claims: {
        openid: ['sub', 'provider', 'username'],
        email: ['email', 'email_verified'],
      },
      cookies: { keys: settings.SECURE_KEY.split(',') },
      jwks: settings.jwks,
      ttl: {
        // Sessions
        Session: 1209600, // 14 days in seconds
        Interaction: 600, // 10 minutes
        DeviceCode: 600, // 10 minutes
        // Tokens
        AuthorizationCode: 60, //  1 minute
        IdToken: 3600, // 1 hour
        AccessToken: 86400, // 24 hours
        Grant: 1209600, // 14 days in seconds
      },
      routes: {
        authorization: '/auth',
        jwks: '/jwks',
        revocation: '/token/revocation',
        introspection: '/token/introspection',
        token: '/token',
        userinfo: '/me',
      },

      interactions: {
        url: async function interactionsUrl(ctx, interaction) {
          const provider =
            ctx.req?.apiGateway?.event?.queryStringParameters?.login_provider
          if (provider)
            return `/oauth/interaction/${interaction.uid}?login_provider=${provider}`
          return `/oauth/interaction/${interaction.uid}`
        },
      },
      features: {
        devInteractions: { enabled: false },
        introspection: {
          enabled: true,
          allowedPolicy: async (ctx) => {
            if (ctx.oidc.client.clientId !== 'api-server') {
              // Restrict introspectection to api-server only
              return ctx.res.status(401).send('Unauthorized')
            }
            return true
          },
        },
      },
      renderError: (ctx, out) => {
        ctx.res.redirect(
          '/redirect/oauth?' +
            Object.entries(out)
              .map(([key, value]) => `${key}=${encodeURIComponent(value)}&`)
              .reduce((a, b) => a + b, '')
        )
      },
    },
    settings.config
  )
}
