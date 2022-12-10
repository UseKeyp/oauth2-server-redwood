export const OAUTH_AUTHORITY_AUTHORIZE = gql`
  mutation oAuthAuthorize(
    $code_challenge: String!
    $code_challenge_method: String!
    $client_id: String!
    $scope: String!
    $redirect_uri: String!
    $response_type: String!
    $state: String!
  ) {
    oAuthAuthorize(
      code_challenge: $code_challenge
      code_challenge_method: $code_challenge_method
      client_id: $client_id
      scope: $scope
      redirect_uri: $redirect_uri
      response_type: $response_type
      state: $state
    ) {
      status
      text
      url
    }
  }
`
