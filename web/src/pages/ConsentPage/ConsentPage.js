import { Link, routes } from '@redwoodjs/router'
import { MetaTags } from '@redwoodjs/web'

import { useOAuthAuthority } from 'src/providers/oAuthAuthority'

const ConsentPage = () => {
  const { continueInteraction } = useOAuthAuthority()

  const onSubmit = async () => {
    await continueInteraction({ type: 'confirm' })
    // Also add cancel option
  }
  return (
    <>
      <MetaTags title="Consent" description="Consent page" />

      <h1>ConsentPage</h1>
      <p>
        Find me in <code>./web/src/pages/ConsentPage/ConsentPage.js</code>
      </p>
      <p>
        My default route is named <code>consent</code>, link to me with `
        <Link to={routes.consent()}>Consent</Link>`
      </p>
    </>
  )
}

export default ConsentPage
