import {
  FieldError,
  Form,
  Label,
  TextField,
  TextAreaField,
  Submit,
} from '@redwoodjs/forms'
import { MetaTags } from '@redwoodjs/web'
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

const UPDATE_ClIENT = gql`
  mutation UpdateClientMutation($id: String!, $redirectUrls: String!) {
    updateClient(id: $id, redirectUrls: $redirectUrls) {
      id
    }
  }
`

export const Success = ({ clients }) => {
  const [updateClient, { loading, error }] = useMutation(UPDATE_ClIENT, {
    onCompleted: () => {
      toast.success('Client updated!')
    },
  })

  const onSubmit = (data) => {
    console.log(data)
    updateClient({ variables: data })
  }

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
            <Submit disabled={loading}>Update</Submit>
          </Form>
        </div>
      ))}
    </div>
  )
}
