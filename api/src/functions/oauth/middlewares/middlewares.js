// See https://github.com/panva/node-oidc-provider/blob/v7.x/docs/README.md#pre--and-post-middlewares
// eslint-disable-next-line no-unused-vars
const middlewares = (oidc) => async (ctx, next) => {
  // PRE MIDDLEWARE
  await next()
  // POST MIDDLEWARE
  // console.log('post middleware', ctx.method, ctx.oidc.route)
}

export default middlewares
