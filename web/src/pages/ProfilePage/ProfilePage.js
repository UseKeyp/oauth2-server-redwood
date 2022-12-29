import { useAuth } from '@redwoodjs/auth'
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

import OidcCell from 'src/components/OidcCell'

const CREATE_ClIENT = gql`
  mutation CreateContactMutation {
    createClient {
      id
    }
  }
`
const ProfilePage = () => {
  const { currentUser } = useAuth()

  const [createClient, { loading, error }] = useMutation(CREATE_ClIENT, {
    onCompleted: () => {
      toast.success('Client created!')
    },
  })

  const onSubmit = () => {
    createClient()
  }

  return (
    <>
      <MetaTags title="Profile" description="My profile" />
      <h2>Profile</h2>
      <h3>Current user</h3>
      <ul>
        <li>id: {currentUser?.id}</li>
        <li>email: {currentUser?.email}</li>
        <li>username: {currentUser?.username}</li>
        <li>accessToken: {currentUser?.accessToken}</li>
        <li>refreshToken: {currentUser?.refreshToken}</li>
      </ul>
      <h3>Create a Client</h3>
      <Form onSubmit={onSubmit} config={{ mode: 'onBlur' }}>
        <Submit disabled={loading}>Create</Submit>
      </Form>
      <h3>Clients</h3>
      <OidcCell />
    </>
  )
}

export default ProfilePage
