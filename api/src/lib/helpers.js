export const isDevelopment =
  ['local', 'dev', 'sandbox'].includes(process.env.ENVIRONMENT) ||
  process.env.NODE_ENV == null

export const isProduction = !isDevelopment

export const cors = {
  origin: isProduction
    ? process.env.APP_DOMAIN
    : [
        process.env.APP_DOMAIN,
        'http://0.0.0.0:3000',
        'http://localhost:3000',
        'http://localhost',
        'http://10.0.2.2:3000',
      ],
  credentials: true,
}
