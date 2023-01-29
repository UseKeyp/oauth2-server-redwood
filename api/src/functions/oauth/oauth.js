import oauth2Server from 'oauth2-server-redwood'
import serverless from 'serverless-http'

import { db } from 'src/lib/db'
import { APP_DOMAIN } from 'src/lib/helpers'
import jwks from 'src/lib/jwks'

console.log(
  process.env.REDWOOD_API_URL || `${process.env.APP_DOMAIN}/.redwood/functions`
)
export const handler = serverless(
  oauth2Server(db, {
    SECURE_KEY: process.env.OAUTH_SECRET_KEY,
    ISSUER_URL: APP_DOMAIN,
    REDWOOD_API_URL:
      process.env.REDWOOD_API_URL ||
      `${process.env.APP_DOMAIN}/.redwood/functions`,
    INTROSPECTION_SECRET: process.env.INTROSPECTION_SECRET,
    routes: { login: '/login', authorize: '/authorize' },
    jwks,
    config: {
      // OIDC-Provider config, see https://github.com/panva/node-oidc-provider
      clients: [
        {
          // Example client for testing, see https://oauth2-client-redwood-eta.vercel.app/login
          client_id: '123',
          redirect_uris: [
            'https://jwt.io',
            'https://oauthdebugger.com/debug',
            'http://0.0.0.0:8910/redirect/oauth2_server_redwood',
            'https://oauth2-client-redwood-eta.vercel.app/redirect/node_oidc',
          ],
        },
        {
          // Example client for testing, see https://oauth2-client-redwood-eta.vercel.app/login
          client_id: 'dev-portal',
          redirect_uris: ['http://0.0.0.0:8910/redirect/keyp'],
        },
      ],
    },
  })
)
