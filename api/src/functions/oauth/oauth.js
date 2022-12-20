import app from '@usekeyp/oauth2-server'
import serverless from 'serverless-http'

import { db } from 'src/lib/db'

export const handler = serverless(app({ db }))
