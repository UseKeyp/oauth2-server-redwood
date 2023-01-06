import merge from 'deepmerge'

import { findAccount } from './account'
import getAdapter from './adapter'
import htmlSafe from './helpers'
import jwks from './jwks'

export const getConfig = (db, settings) => {
  const adapter = getAdapter(db)
  return merge(
    {
      adapter,
      findAccount: findAccount(db),
      clients: [
        {
          client_id: 'api-server',
          client_secret: settings.INTROSPECTION_SECRET,
          redirect_uris: [],
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
      scopes: ['openid'],
      issueRefreshToken: (ctx, client, code) => {
        return (
          client.grantTypeAllowed('refresh_token') &&
          code.scopes.has('offline_access')
        )
      },
      pkce: { require: true, methods: ['S256'] },
      responseTypes: ['code id_token', 'code', 'id_token'],
      scopes: ['openid', 'offline_access'],
      claims: {
        openid: ['sub'],
        email: ['email', 'email_verified'],
      },
      cookies: { keys: settings.SECURE_KEY.split(',') },
      jwks,
      ttl: {
        // Sessions
        Session: 1209600, // 14 days in seconds
        Interaction: 600, // 10 minutes
        DeviceCode: 600, // 10 minutes
        // Tokens
        AuthorizationCode: 60, //  1 minute
        IdToken: 3600, // 1 hour
        AccessToken: 86400, // 24 hours
      },
      routes: {
        authorization: '/auth',
        backchannel_authentication: '/backchannel',
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
    },
    settings.config
  )
}
