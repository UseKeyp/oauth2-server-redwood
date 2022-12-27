import { findAccount } from './account'
import htmlSafe from './helpers'

const jwks = require('./jwks')

export const getConfig = (db) => {
  return {
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
      DeviceCode: 600,
      IdToken: 3600,
      Interaction: 600,
      Session: 1440,
      AccessToken: 86400,
    },
    findAccount: findAccount(db),
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
        const provider =
          ctx.req?.apiGateway?.event?.queryStringParameters?.login_provider
        if (provider)
          return `/oauth/interaction/${interaction.uid}?login_provider=${provider}`
        return `/oauth/interaction/${interaction.uid}`
      },
    },

    features: {
      introspection: {
        enabled: true,
        introspectionAllowedPolicy: (ctx, client, token) => {
          if (
            client.clientAuthMethod === 'none' &&
            token.clientId !== ctx.oidc.client.clientId
          ) {
            return false
          }
          return true
        },
      },
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
  }
}
