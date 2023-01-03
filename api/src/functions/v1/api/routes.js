const routes = (router) => {
  // Validate scope

  // Process request
  router.get('/sanity-check', tokenIntrospection, async (req, res) => {
    return res.send({ success: true })
  })

  return router
}

export default routes
