import serverless from 'serverless-http'

import { useRequireAuth } from '@redwoodjs/graphql-server'

import app from 'src/functions/oauth/server'
import { getCurrentUser } from 'src/lib/auth'

export const myHandler = serverless(app)

export const handler = useRequireAuth({
  handlerFn: myHandler,
  getCurrentUser,
})
