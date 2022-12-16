import serverless from 'serverless-http'

import app from 'src/functions/oauth/server'

export const handler = serverless(app)
