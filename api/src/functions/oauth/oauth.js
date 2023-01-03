import oauth2Server from 'oauth2-server-redwood'
import serverless from 'serverless-http'

import { db } from 'src/lib/db'

export const handler = serverless(
  oauth2Server(db, {
    SECURE_KEY: process.env.SECURE_KEY,
    APP_DOMAIN: process.env.APP_DOMAIN,
    routes: { login: '/login', authorize: '/authorize' },
    config: {
      // OIDC-Provider config, see https://github.com/panva/node-oidc-provider
      clients: [
        {
          client_id: '123',
          client_secret: 'somesecret',
          redirect_uris: [
            'https://jwt.io',
            'https://oauthdebugger.com/debug',
            'http://0.0.0.0:8910/redirect/oauth2_server_redwood',
            'https://oauth2-client-redwood-eta.vercel.app/redirect/node_oidc',
          ],
          token_endpoint_auth_method: ['client_secret_post'],
        },
      ],
      features: {
        devInteractions: { enabled: false },
        introspection: {
          enabled: true,
          introspectionAllowedPolicy: async (ctx, client, token) => {
            console.log(client)
            if (
              client.clientAuthMethod === 'none' &&
              token.clientId !== ctx.oidc.client.clientId
            ) {
              return false
            }
            return true
          },
        },
      },
    },
  })
)
