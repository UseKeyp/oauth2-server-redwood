// See server code in /packages/oauth2-server
// import app from '@oauth2-server-redwood/server'

import serverless from 'serverless-http'

import { useRequireAuth } from '@redwoodjs/graphql-server'

import { getCurrentUser } from 'src/lib/auth'

import app from './server'
// import { db } from 'src/lib/db'

// export const myHandler = serverless(app({ db }))
export const myHandler = serverless(app)

export const handler = useRequireAuth({
  handlerFn: myHandler,
  getCurrentUser,
})
