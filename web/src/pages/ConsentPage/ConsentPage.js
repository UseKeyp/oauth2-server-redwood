import { MetaTags } from '@redwoodjs/web'

import { useOAuthAuthority } from 'src/providers/oAuthAuthority'

const ConsentPage = () => {
  const { continueInteraction, saveInteraction } = useOAuthAuthority()

  React.useEffect(() => {
    saveInteraction && saveInteraction()
  }, [saveInteraction])

  return (
    <>
      <MetaTags title="Consent" description="Consent page" />

      <h1>Consent</h1>
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

export default ConsentPage
