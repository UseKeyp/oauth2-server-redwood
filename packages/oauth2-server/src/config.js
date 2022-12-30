import { findAccount } from './account'
import getAdapter from './adapter'
import htmlSafe from './helpers'
import jwks from './jwks'

export const getConfig = (db, settings) => {
  const adapter = getAdapter(db)
  return {
    adapter,
    findAccount: findAccount(db),
    clientDefaults: {
      grant_types: ['authorization_code'],
      id_token_signed_response_alg: 'RS256',
      response_types: ['code'],
      token_endpoint_auth_method: 'client_secret_post',
    },
    // TODO: unsure if this config is needed
    // clientAuthMethods: ['client_secret_post'],
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
      // TODO: enable introspection for API server
      // introspection: {
      //   enabled: true,
      //   introspectionAllowedPolicy: (ctx, client, token) => {
      //     if (
      //       client.clientAuthMethod === 'none' &&
      //       token.clientId !== ctx.oidc.client.clientId
      //     ) {
      //       return false
      //     }
      //     return true
      //   },
      // },
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
    ...settings.config,
  }
}
