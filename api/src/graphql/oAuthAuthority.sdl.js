export const schema = gql`
  type AuthorizationResponse {
    status: OAuthAuthorityStatus
    text: String
    url: String
  }

  type Mutation {
    oAuthAuthorize(
      code_challenge: String!
      code_challenge_method: String!
      client_id: String!
      scope: String!
      redirect_uri: String!
      response_type: String!
      state: String!
    ): AuthorizationResponse! @requireAuth
  }
  enum OAuthAuthorityStatus {
    SUCCESS
    FAILED
  }
`
