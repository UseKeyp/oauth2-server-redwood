import { useEffect, useState } from 'react'

import { useAuth } from '@redwoodjs/auth'
import { MetaTags } from '@redwoodjs/web'

import { useOAuthAuthority } from 'src/providers/oAuthAuthority'

const AuthorizePage = () => {
  const [client, setClient] = useState({})
  const [scopes, setScopes] = useState([])
  const { currentUser } = useAuth()
  const { continueInteraction } = useOAuthAuthority()

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search)
    setClient({
      name: searchParams.get('clientName'),
      logoUri: searchParams.get('clientLogoUri'),
      policyUri: searchParams.get('clientPolicyUri'),
      tosUri: searchParams.get('clientTosUri'),
    })
    searchParams.get('scope') && setScopes(searchParams.get('scope').split(','))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <MetaTags title="Authorize" description="Authorize page" />
      <div>
        <div>
          <div>
            <div>{currentUser?.username}</div>
          </div>
          <br />
          <div>
            <div>This app wants the following permissions:</div>
            <br />
            <div>
              {client.logoUri && (
                <div>
                  <img src={client.logoUri} alt={client.name} />
                </div>
              )}
              <div>{client.name && <div>{client.name}</div>}</div>
            </div>
            <br />
          </div>
          <div>
            Scopes:
            <ul>
              {scopes.map((scope) => (
                <li key={scope}>{scope}</li>
              ))}
            </ul>
          </div>
          <br />
          <div>
            <button onClick={() => continueInteraction({ type: 'abort' })}>
              Cancel
            </button>
            <button onClick={() => continueInteraction({ type: 'confirm' })}>
              Confirm
            </button>
          </div>
          <br />
          <div>
            By clicking Confirm, you allow this app and Keyp to use your
            information in accordance with their respective{' '}
            {client.tosUri ? (
              <a href={client.tosUri}>terms</a>
            ) : (
              <div>terms</div>
            )}{' '}
            and{' '}
            {client.policyUri ? (
              <a href={client.policyUri}>privacy policies.</a>
            ) : (
              <div>privacy policies.</div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default AuthorizePage
