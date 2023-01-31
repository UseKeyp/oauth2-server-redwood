<h1 align="left">Welcome to Oauth2 Server Redwood 👋</h1>
<p align="left">
  <a href="#" target="_blank">
    <img alt="License: MIT" src="https://img.shields.io/badge/License-MIT-blue.svg" />
  </a>
</p>

> OAuth2 server with dynamic client registration and test API, built with OIDC-Provider for RedwoodJS

<p align="left">
<img width="500px" src="./packages/oauth2-server/demo.png"/>
</p>

🚧 IN DEVELOPMENT 🚧

"Authority" means that you are providing authentication or authorization as a service for _other apps_. For example "Sign in with MyCompanyApp", as opposed to "Sign in with Google".  If you're just looking to implement an OAuth2 client in your app, check out [`oauth2-client-redwood`][oauth2-client-redwood].

## Demo ⏯️

Point your `oauth2-client-redwood` or `passport.js` app to the demo server:

https://oauth2-server-redwood.vercel.app/

Here is the available client config. Let me know if you want to add your own client to the demo server, or make a PR.

```
client_id: '123',
redirect_uris: [
            'https://jwt.io',
            'https://oauthdebugger.com/debug',
            'http://0.0.0.0:8910/redirect/oauth2_server_redwood',
            'https://oauth2-client-redwood-eta.vercel.app/redirect/node_oidc',
          ],
```

## Get Started

#### Add to your own app

See the package [README.md](https://github.com/UseKeyp/oauth2-server-redwood/blob/dev/packages/oauth2-server/README.md)

#### Try it out first

Clone the repo, copy the `.env.example` to `.env`, and run `yarn rw dev`.

#### Docker option

`./docker-compose.yml` is configured to run the app and the database.

To build the docker images locally run

```
earthly +docker --push -P
```

Test the images with

```
docker compose up
```

## Sponsors ❤️

[<img height="65" align="left" src="https://github.com/UseKeyp/.github/blob/main/Keyp-Logo-Color.png?raw=true" alt="keyp-logo">][sponsor-keyp] Improve onboarding and payments in your games & web3 apps effortlessly with OAuth logins for wallets and debit card transactions. [Create a Keyp account; it's free!][sponsor-keyp]<br><br>

## License 📝

Copyright © 2023 Nifty Chess, Inc.<br />
This project is MIT licensed.

[sponsor-keyp]: https://UseKeyp.com
[oauth2-client-redwood]: https://github.com/UseKeyp/oauth2-client-redwood

