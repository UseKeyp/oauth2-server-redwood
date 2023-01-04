import assert from 'assert'
import path from 'path'

import { logger } from '@sentry/utils'
import bodyParser from 'body-parser'
import express from 'express'
import fetch from 'node-fetch'

import routes from './routes'

const encodeBody = (body) =>
  Object.keys(body)
    .map((key) => encodeURIComponent(key) + '=' + encodeURIComponent(body[key]))
    .join('&')

const app = (db, settings) => {
  // Express docs https://expressjs.com/en/5x/api.html#app.settings.table
  const app = express()
  app.set('trust proxy', true)
  app.set('view engine', 'ejs')
  app.set('views', path.resolve(__dirname, 'views'))

  console.log(settings.version)

  // Validate token
  const tokenIntrospection = async (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1]
    const response = await fetch(
      settings.APP_DOMAIN + '/oauth/token/introspection',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        },
        body: encodeBody({ token }),
      }
    ).then((res) => res.json())
    console.log(response)
    if (!response.active) return res.status(401).send('Unauthorized')
    req.ctx = { user: response.sub, scope: response.scope }
    next()
  }

  const parse = bodyParser.urlencoded({ extended: false })

  // TODO: set version route prefix
  app.get('/v1/sanity-check', tokenIntrospection, async (req, res) => {
    return res.send({ success: true })
  })

  // TODO: set cache policy
  function cachePolicy(req, res, next) {
    res.set('Pragma', 'no-cache')
    res.set('Cache-Control', 'no-cache, no-store')
    next()
  }

  return app
}

export default app
