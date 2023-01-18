import { FieldError, Form, Label, TextField, Submit } from '@redwoodjs/forms'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

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

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Empty</div>

export const Failure = ({ error }) => (
  <div style={{ color: 'red' }}>Error: {error?.message}</div>
)

/* eslint-disable-next-line camelcase */
const UPDATE_ClIENT = gql`
  mutation UpdateClientMutation(
    $id: String!
    $redirectUrls: String!
    $clientURI: String!
    $clientName: String!
    $tosURI: String!
    $logoURI: String!
    $policyURI: String!
  ) {
    updateClient(
      id: $id
      redirectUrls: $redirectUrls
      clientURI: $clientURI
      clientName: $clientName
      tosURI: $tosURI
      logoURI: $logoURI
      policyURI: $policyURI
    ) {
      id
    }
  }
`

export const Success = ({ clients }) => {
  const [updateClient, { loading }] = useMutation(UPDATE_ClIENT, {
    onCompleted: () => {
      toast.success('Client updated!')
    },
    onError: (error) => {
      toast.error(error.message)
    }
  })

  const onSubmit = (data) => {
    console.log(data)
    updateClient({ variables: data })
  }

  console.log(clients)

  return (
    <div>
      {clients.map((client) => (
        <div key={client.id}>
          <h4>{client.id}</h4>
          <ul>
            {Object.keys(client).map((key) => {
              return (
                <li key={key}>
                  {key}: {JSON.stringify(client[key])}
                </li>
              )
            })}
          </ul>
          <Form
            onSubmit={(data) => onSubmit({ id: client.id, ...data })}
            config={{ mode: 'onBlur' }}
          >
            <Label name="name" errorClassName="error">
              Redirect Urls (comma separated)
            </Label>
            <TextField
              name="redirectUrls"
              errorClassName="error"
              validation={{ required: true }}
            />
            <FieldError name="redirectUrls" className="error" />
            <br />
            <Label name="clientURI" errorClassName="error">
              Client Uri
            </Label>
            <TextField
              name="clientURI"
              errorClassName="error"
              validation={{ required: true }}
            />
            <FieldError name="clientURI" className="error" />
            <br />
            <Label name="clientName" errorClassName="error">
              Client Name
            </Label>
            <TextField
              name="clientName"
              errorClassName="error"
              validation={{ required: true }}
            />
            <FieldError name="clientName" className="error" />
            <br />
            <Label name="tosURI" errorClassName="error">
              TOS Uri
            </Label>
            <TextField
              name="tosURI"
              errorClassName="error"
              validation={{ required: true }}
            />
            <FieldError name="tosURI" className="error" />
            <br />
            <Label name="logoURI" errorClassName="error">
              Logo Uri
            </Label>
            <TextField
              name="logoURI"
              errorClassName="error"
              validation={{ required: true }}
            />
            <FieldError name="logoURI" className="error" />
            <br />
            <Label name="policyURI" errorClassName="error">
              Policy Uri
            </Label>
            <TextField
              name="policyURI"
              errorClassName="error"
              validation={{ required: true }}
            />
            <FieldError name="policyURI" className="error" />
            <br />
            <Submit disabled={loading}>Update</Submit>
          </Form>
        </div>
      ))}
    </div>
  )
}
