#!/usr/bin/env node
'use strict'

const fs = require('fs')
const path = require('path')

const jose = require('jose')

const keystore = new jose.JWKS.KeyStore()

Promise.all([
  keystore.generate('RSA', 2048, { alg: 'RS256', use: 'sig' }),
  keystore.generate('EC', 'P-256', { use: 'sig', alg: 'ES256' }),
  keystore.generate('OKP', 'Ed25519', { use: 'sig', alg: 'EdDSA' }),
]).then(() => {
  fs.writeFileSync(
    path.resolve('./jwks.js'),
    `module.exports = ${JSON.stringify(keystore.toJWKS(true), null, 2)}`
  )
})
