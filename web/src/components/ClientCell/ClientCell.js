import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import Button from '../Button/Button.js'
import ClientCredentials from '../ClientCredentials/ClientCredentials.js'

export const QUERY = gql`
  query ClientsQuery {
    clients {
      id
      payload
      createdAt
      updatedAt
      accessLevel
    }
  }
`

const CREATE_ClIENT = gql`
  mutation CreateClientMutation {
    createClient {
      id
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => {
  const [createClient, { loading, error }] = useMutation(CREATE_ClIENT, {
    refetchQueries: [{ query: QUERY }],
    onCompleted: () => {
      toast.success('Client created!')
    },
  })

  return (
    <>
      <Button variant="green" onClick={createClient} disabled={loading}>
        Create
      </Button>
      {error?.message}
    </>
  )
}

export const Failure = ({ error }) => (
  <div style={{ color: 'red' }}>Error: {error?.message}</div>
)

export const Success = ({ clients }) => {
  return (
    <div>
      {clients.map((client) => (
        <ClientCredentials key={client.id} client={client} />
      ))}
    </div>
  )
}
