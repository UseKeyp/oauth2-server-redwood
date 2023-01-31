import serverless from 'serverless-http'

import { db } from 'src/lib/db'

import publicApi from './api'

export const handler = serverless(
  publicApi(db, {
    APP_DOMAIN: process.env.APP_DOMAIN,
    version: 'v1', // Route prefix eg. /api/v1/<Endpoint>
  })
)
