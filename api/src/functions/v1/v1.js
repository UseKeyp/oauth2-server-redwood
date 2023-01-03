import serverless from 'serverless-http'

import { db } from 'src/lib/db'
import { logger } from 'src/lib/logger'

import publicApi from './public-api'

export const handler = serverless(
  publicApi(db, {
    APP_DOMAIN: process.env.APP_DOMAIN,
    routes: { introspection: '/oauth/token/introspect' },
    version: 'v1', // Route prefix eg. /api/v1/<Endpoint>
  })
)
