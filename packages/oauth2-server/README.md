<h1 align="left">Welcome to Oauth2 Server Redwood 👋</h1>
<p align="left">
  <a href="#" target="_blank">
    <img alt="License: MIT" src="https://img.shields.io/badge/License-MIT-blue.svg" />
  </a>
</p>

> OAuth2 server with dynamic client registration and test API, built with Oidc-Provider for RedwoodJS

<p align="left">
<img width="500px" src="https://github.com/UseKeyp/oauth2-server-redwood/blob/dev/packages/oauth2-server/demo.png"/>
</p>

🚧 IN DEVELOPMENT 🚧

"Authority" means that you are providing authentication or authorization as a service for _other apps_. For example "Sign in with MyCompanyApp", as opposed to "Sign in with Google". If you're just looking to implement an OAuth2 client in your app, check out [`oauth2-client-redwood`][oauth2-client-redwood].

## Demo ⏯️

Hosted demo coming soon

## Usage

To add the OAuth2 server to your own app:

1. Create a new api function `oauth` and install the packages

```bash
yarn add oauth2-server-redwood serverless-http
```

```js
// api/src/functions/oauth.js
import oauth2Server from 'oauth2-server-redwood'
import serverless from 'serverless-http'

import { db } from 'src/lib/db'

export const handler = serverless(
  oauth2Server(db, {
    SECURE_KEY: process.env.SECURE_KEY,
    APP_DOMAIN: process.env.APP_DOMAIN,
    INTROSPECTION_SECRET: process.env.INTROSPECTION_SECRET,
    routes: { login: '/login', authorize: '/authorize' },
    config: {
      // Define your own OIDC-Provider config (https://github.com/panva/node-oidc-provider)
      clients: [
        {
          client_id: '123',
          redirect_uris: [
            'https://jwt.io',
            'https://oauthdebugger.com/debug',
            'http://0.0.0.0:8910/redirect/oauth2_server_redwood',
          ],
        },
      ],
    },
  })
)
```

2. Copy the .env.example to .env and update the values

3. Setup an Nginx proxy. I've included `oauth2-server-redwood.conf` which removes the prefix and serves the endpoint from `localhost/oauth` instead of `localhost/api/oauth`. Oidc-provider does not always adhere to the `/api` path prefix when setting cookie path, or my implementation is incorrect. If you you can help solve this, please let me know!

4. Setup dbAuth and update the graphql schema. Copy the schema here or see [`oauth2-client-redwood`][oauth2-client-redwood].

```bash
yarn rw setup auth dbAuth
```

## Test

To test the Oauth2 server, you can use https://oauthdebugger.com/

- Authorize URI: http://localhost/oauth/auth
- Client ID: 123
- Scope: openid email profile
- Use PKCE: true

<img width="400px" src="https://github.com/UseKeyp/oauth2-server-redwood/blob/dev/packages/oauth2-server/oauth-debugger.png">

Alternatively, you can test using only Redwood apps. Clone [`oauth2-client-redwood`][oauth2-client-redwood] and update `.env` to point to your server:

```
OAUTH2_SERVER_REDWOOD_API_DOMAIN=http://localhost/oauth
```

To simulate an API request using the user's access token, create a request to `http://localhost/api/v1/sanity-check` using the access token from the client (eg. oauthdebugger or oauth2-client-redwood)

<img width="500px" src="https://github.com/UseKeyp/oauth2-server-redwood/blob/dev/packages/oauth2-server/api-demo.png">

## Test



## Config

To enable refresh tokens, add grant_type 'refresh_token' to the client.

> NOTE: You should only enable refresh tokens for confidential clients. To do this, set `token_endpoint_auth_method` to `client_secret_post`

```js
tokenEndpointAuthMethods: ['client_secret_post'],
clientDefaults: {
  grant_types: ['authorization_code', 'refresh_token'],
  token_endpoint_auth_method: 'client_secret_post',
  //...
},
scopes: ['openid', 'offline_access'],
```

## Contributing 💡

To run this repo locally:

- Clone the repo and follow steps 2 & 3 above
- Run `yarn build:watch` in `/packages/oauth2-server`
- Run `yarn rw dev` to start the app

## TODO

- [x] Validate rw session tokens during login
- [ ] Upgrade to latest oidc-provider (blocked by lack of support for "require")
- [ ] Add dbAuth username/password option to make the demo simpler to understand
- [ ] Show proper scopes for consent page
- [ ] Improve the UI

## Resources 🧑‍💻

- OAuth Server libraries: https://oauth.net/code/nodejs/
- Similar tools https://github.com/panva/oauth4webapi/blob/main/examples/code.ts and https://github.com/panva/node-openid-client

## Sponsors ❤️

[<img height="65" align="left" src="https://github.com/UseKeyp/.github/blob/main/Keyp-Logo-Color.png?raw=true" alt="keyp-logo">][sponsor-keyp] Improve onboarding and payments in your games & web3 apps effortlessly with OAuth logins for wallets and debit card transactions. [Create a Keyp account; it's free!][sponsor-keyp]<br><br>

## License 📝

Copyright © 2023 Nifty Chess, Inc.<br />
This project is MIT licensed.

[sponsor-keyp]: https://UseKeyp.com
[oauth2-client-redwood]: https://github.com/UseKeyp/oauth2-client-redwood

```

```
