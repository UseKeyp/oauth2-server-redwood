import oauth2Server from 'oauth2-server-redwood'
import serverless from 'serverless-http'

import { db } from 'src/lib/db'

export const handler = serverless(
  oauth2Server({
    db,
    settings: {
      // Required
      SECURE_KEY: process.env.SECURE_KEY,
      APP_DOMAIN: process.env.APP_DOMAIN,
      // Optional defaults
      loginRoute: '/login',
    },
  })
)
