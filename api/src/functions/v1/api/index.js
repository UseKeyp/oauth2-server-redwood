import express from 'express'
import fetch from 'node-fetch'

import router from './router'

const encodeBody = (body) =>
  Object.keys(body)
    .map((key) => encodeURIComponent(key) + '=' + encodeURIComponent(body[key]))
    .join('&')

const app = (db, settings) => {
  // TODO: set cache policy
  // function cachePolicy(req, res, next) {
  //   res.set('Pragma', 'no-cache')
  //   res.set('Cache-Control', 'no-cache, no-store')
  //   next()
  // }

  const validateToken = async (req, res, next) => {
    try {
      const token = req?.headers?.authorization?.split(' ')[1]
      const response = await fetch(
        settings.APP_DOMAIN + '/oauth/token/introspection',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
          },
          body: encodeBody({
            token,
            client_id: 'api-server',
            client_secret: process.env.INTROSPECTION_SECRET,
          }),
        }
      ).then((res) => res.json())
      console.log(response)
      if (!response.active) return res.status(401).send('Unauthorized')
      req.ctx = { user: response.sub, scope: response.scope }
      next()
    } catch (error) {
      console.error(error)
      res.status(500).send('Internal Server Error')
    }
  }

  // Express docs https://expressjs.com/en/5x/api.html#app.settings.table
  const app = express()
  app.set('trust proxy', true)
  app.use(validateToken)
  app.use(`/${settings.version}`, router) // Prefix routes eg. /v1/sanity-check

  return app
}

export default app
