var express = require('express')

var router = express.Router()

router.get('/sanity-check', async (req, res) => {
  return res.send({ success: true })
})

module.exports = router
