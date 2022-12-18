<h1 align="center"><img width="600" style="border-radius: 30px;" src="https://raw.githubusercontent.com/UseKeyp/.github/main/Keyp-Logo-Color.svg"/></h1>
<h1 align="center">Welcome to OAuth Server Redwood 👋</h1>
<p align="center">
  <a href="#" target="_blank">
    <img alt="License: MIT" src="https://img.shields.io/badge/License-MIT-blue.svg" />
  </a>
  <a href="https://twitter.com/UseKeyp" target="_blank">
    <img alt="Twitter: UseKeyp" src="https://img.shields.io/twitter/follow/UseKeyp.svg?style=social" />
  </a>
</p>

If you'd like to join our team please let us know. Happy hacking!

<p align="center">
<img width="600px" src="oauth-server-redwood-demo.gif"/>
</p>

> A demo OAuth2 authority server built using Redwood and oidc-provider

🚧 IN DEVELOPMENT 🚧

"Authority" means that you are providing authentication or authorization as a service for _other apps_. For example "Sign in with MyCompanyApp", as opposed to "Sign in with Google".  If you're just looking to implement an OAuth2 client in your app, check out [`oauth2-client-redwood`](https://github.com/usekeyp/oauth2-client-redwood).

## Demo 📙

In the example gif above, its important to note that the server is wrapping the user's Discord account with its own account (double authentication). The flow could also just use normal username/password.
## Developing

Here's the user-agent flow for a standard node-oidc-provider. Note ours is slightly modified, since we use our Redwood app UI for the login and consent screens.

<img  src="user-agent-flow.png"/>

## Contributing guide

To run this repo locally:

- Update your .env from `.env.example`.
- You'll need to setup a nginx proxy, since oidc-provider sometimes ignores the extra `/api` path prefix, and cookie paths are not set properly. I've included `oauth2-server-redwood.conf` which removes the prefix and serves the endpoint from `localhost/oauth` instead of `localhost/api/oauth`. I'm open to other ideas here if you'd like to help!

## TODO

- [x] Validate rw session tokens during login
- [ ] Add claims to the user model and fetch in `findAccount`
- [ ] Show proper scopes for consent page
- [ ] Improve the UI
- [ ] Fix redirect bug to /profile
- [ ] Add dbAuth username/password option to make the demo simpler to understand
- [ ] Security audit
## Resources 🧑‍💻

- OAuth Server libraries: https://oauth.net/code/nodejs/
- Similar tools https://github.com/panva/oauth4webapi/blob/main/examples/code.ts and https://github.com/panva/node-openid-client

## Contributors ✨

👤 **Keyp Team <maintainers@UseKeyp.com>**

- Website: https://UseKeyp.com
- Twitter: [@UseKeyp](https://twitter.com/UseKeyp)
- GitHub: [@UseKeyp](https://github.com/UseKeyp)

## License 📝

Copyright © 2022 Nifty Chess, Inc.<br />
This project is MIT licensed.


