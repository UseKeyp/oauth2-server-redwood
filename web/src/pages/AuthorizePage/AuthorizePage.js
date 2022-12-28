import { MetaTags } from '@redwoodjs/web'

import { useOAuthAuthority } from 'src/providers/oAuthAuthority'

const AuthorizePage = () => {
  const { continueInteraction } = useOAuthAuthority()

  return (
    <>
      <MetaTags title="Authorize" description="Authorize page" />

      <h1>Authorize</h1>
      <p>Approve this app to access your account</p>
      <p>
        <button onClick={() => continueInteraction({ type: 'confirm' })}>
          Confirm
        </button>
        <button onClick={() => continueInteraction({ type: 'abort' })}>
          Cancel
        </button>
      </p>
    </>
  )
}

export default AuthorizePage
