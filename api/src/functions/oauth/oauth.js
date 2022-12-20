// See server code in /packages/oauth2-server
// import app from '@oauth2-server-redwood/server'
import serverless from 'serverless-http'

import { useRequireAuth } from '@redwoodjs/graphql-server'

import { getCurrentUser } from 'src/lib/auth'
import { db } from 'src/lib/db'

import app from './server'

export const myHandler = serverless(app({ db }))

export const handler = useRequireAuth({
  handlerFn: myHandler,
  getCurrentUser,
})
