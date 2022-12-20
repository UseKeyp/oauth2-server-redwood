# Redwood Login page test

Tried using a /login page on redwood (eg `localhost:3000/login`), and POSTing back to the /interaction/:uid/login endpoint. Tried two different things:

1. oauth2-server-redwood

A oidc-provider hosted in a redwood funciton `/api/oauth`

> invalid_request authorization request has expired. iss: http://localhost:3000/api/oauth

Likely cause is that not _all the cookies_ are being consumed by the server properly. Some are being set with invalid paths eg `/oauth/auth..` instead of `/api/oauth/auth...`. There is inconsistency in the node-oidc-provider library for how path is managed- which means we can't have the server hosted from a prefixed route (eg. `/api/oauth/`)

2. keyp-oauth2-server

a oidc-proviced hosted as a normal express app

> SessionNotFound: invalid_request at Provider.getInteraction

Likely cause is the cookies not being passed, since cross-domain request is required from :3000 to :3210

# OIDC-provider login page w/ redwood functions

Redirect from the social provider can be directly back to the authority server

:3210/auth
discord.com/oauth

# nginx / proxy running locally to allow same-domains during local testing
