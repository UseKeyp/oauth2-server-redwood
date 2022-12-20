import app from '@oauth2-server-redwood/server'
import serverless from 'serverless-http'

import { useRequireAuth } from '@redwoodjs/graphql-server'

import { getCurrentUser } from 'src/lib/auth'
import { db } from 'src/lib/db'

export const handler = useRequireAuth({
  handlerFn: serverless(app({ db })),
  getCurrentUser,
})
