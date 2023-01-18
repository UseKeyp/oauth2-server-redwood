export const schema = gql`
  type Oidc {
    id: String!
    payload: JSON!
    createdAt: DateTime!
    updatedAt: DateTime!
    accessLevel: ClientPermissions
  }

  type Mutation {
    createClient: Oidc! @requireAuth
    updateClient(id: String!, redirectUrls: String!, clientURI: String!, clientName: String!, tosURI: String!, logoURI: String!, policyURI: String!): Oidc! @requireAuth
    deleteClient(id: String!): Oidc! @requireAuth
  }

  type Query {
    clients: [Oidc!]! @requireAuth
  }

  enum ClientPermissions {
    OWNER
    EDITOR
  }
`
