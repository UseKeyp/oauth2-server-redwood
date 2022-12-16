import pkceChallenge from 'pkce-challenge'

import { db } from 'src/lib/db'

const verifyClient = ({ clientId, clientSecret }) => {}

export const authorize = async ({
  code_challenge,
  code_challenge_method,
  client_id,
  scope,
  redirect_uri,
  response_type,
  state,
}) => {
  // Send request to  oauth2-server-redwood

  return {
    text,
    url: 'https://example.com',
  }
}
