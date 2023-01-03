import assert from 'assert'
import path from 'path'

import bodyParser from 'body-parser'
import express from 'express'
import fetch from 'node-fetch'

const app = (db, settings) => {
  // Express docs https://expressjs.com/en/5x/api.html#app.settings.table
  const expressApp = express()
  expressApp.set('trust proxy', true)
  expressApp.set('view engine', 'ejs')
  expressApp.set('views', path.resolve(__dirname, 'views'))

  const parse = bodyParser.urlencoded({ extended: false })

  // TODO: set version route prefix
  // TODO: set cache policy
  function cachePolicy(req, res, next) {
    res.set('Pragma', 'no-cache')
    res.set('Cache-Control', 'no-cache, no-store')
    next()
  }

  // Validate Access Token locally

  // Token Introspection
  function tokenIntrospection(req, res, next) {
    console.log(req)
    // Ping oauth server /token/introspect
  }

  // Validate scope

  // Process request
  expressApp.get('/v1/sanity-check', async (req, res) => {
    return res.send({ success: true })
  })

  return expressApp
}

export default app
