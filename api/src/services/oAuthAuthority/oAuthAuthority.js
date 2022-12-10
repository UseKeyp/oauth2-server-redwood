import { authorize } from 'src/lib/oAuthAuthority'

export const oAuthAuthorize = ({
  code_challenge,
  code_challenge_method,
  client_id,
  scope,
  redirect_uri,
  response_type,
  state,
}) =>
  authorize({
    code_challenge,
    code_challenge_method,
    client_id,
    scope,
    redirect_uri,
    response_type,
    state,
  })
