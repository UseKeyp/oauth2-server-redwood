<h1 align="left">Welcome to Oauth2 Client Redwood 👋</h1>
<p align="left">
  <a href="#" target="_blank">
    <img alt="License: MIT" src="https://img.shields.io/badge/License-MIT-blue.svg" />
  </a>
</p>

> OAuth2 server with dynamic client registration, built with Oidc-Provider for RedwoodJS

🚧 IN DEVELOPMENT 🚧

"Authority" means that you are providing authentication or authorization as a service for _other apps_. For example "Sign in with MyCompanyApp", as opposed to "Sign in with Google".  If you're just looking to implement an OAuth2 client in your app, check out [`oauth2-client-redwood`][oauth2-client-redwood].

## Demo ⏯️

Hosted demo coming soon

In the example gif above, its important to note that the server is wrapping the user's Discord account with its own account (double authentication). The flow could also just use normal username/password.
## Usage

1. Create a new function `oauth` and install the package

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
    routes: { login: '/login', authorize: '/authorize' },
    config: {
      // Define your own OIDC-Provider config (https://github.com/panva/node-oidc-provider)
      clients: [
        {
          client_id: '123',
          client_secret: 'somesecret',
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

4.  Setup dbAuth and update the graphql schema. Copy the schema here or see [`oauth2-client-redwood`][oauth2-client-redwood].

```bash
yarn rw setup auth dbAuth
```

5. To test, you can use https://oauthdebugger.com/

- Authorize URI: http://localhost/oauth/auth
- Client ID: 123
- Scope: openid email profile
- Use PKCE: true

<img width="400px" src="oauth-debugger.png">

Alternatively, you can test using only Redwood apps. Clone [`oauth2-client-redwood`][oauth2-client-redwood] and update the line in the `.env` file to point to your server:

```
OAUTH2_SERVER_REDWOOD_API_DOMAIN=http://localhost/oauth
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

