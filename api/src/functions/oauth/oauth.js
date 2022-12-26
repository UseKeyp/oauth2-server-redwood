import app from 'oauth2-server-redwood'
import serverless from 'serverless-http'

import { db } from 'src/lib/db'

export const handler = serverless(app({ db }))
