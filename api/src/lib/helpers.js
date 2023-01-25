export const isDevelopment =
  ['local', 'dev', 'sandbox'].includes(process.env.ENVIRONMENT) ||
  process.env.NODE_ENV == null

export const isProduction = !isDevelopment

export const cors = {
  origin: isProduction
    ? APP_DOMAIN
    : [
        APP_DOMAIN,
        'http://0.0.0.0:3000',
        'http://localhost:3000',
        'http://localhost',
        'http://10.0.2.2:3000',
      ],
  credentials: true,
}

let appDomain = process.env.APP_DOMAIN
if (process.env.REDWOOD_ENV_VERCEL_URL) {
  appDomain = `https://${process.env.REDWOOD_ENV_VERCEL_URL}`
}
export const APP_DOMAIN = appDomain
