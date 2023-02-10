import React, { useEffect, useState } from 'react'

import { useAuth } from '@redwoodjs/auth'

import Button from 'src/components/Button'
import Icon from 'src/components/Icon'
import { useOAuthAuthority } from 'src/providers/oAuthAuthority'

function Authorize() {
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
    <div className="flex h-screen flex-col items-center justify-center align-middle">
      <div className="flex max-w-2xl flex-col items-center rounded-lg border border-gray-200 p-4">
        <div className="flex w-full flex-row items-center justify-between">
          <div className="text-gray-400">{currentUser?.username}</div>
        </div>
        <div className="flex flex-row">
          <div className="flex items-center text-2xl text-gray-2400 md:text-3xl">
            This app wants the following permissions
          </div>
          <div className="flex flex-row text-2xl md:text-3xl">
            {client.logoUri && (
              <div className="m-4 flex h-24 w-24 rounded-md bg-white p-4">
                <img
                  src={client.logoUri}
                  alt={client.name}
                  className="mx-auto flex h-16"
                />
              </div>
            )}
            <div className="flex flex-col items-center justify-center">
              {client.name && (
                <div className="flex font-bold">{client.name}</div>
              )}
            </div>
          </div>
        </div>
        <div className="mb-8 mt-8 flex flex-col text-2xl text-black">
          Scopes:
          <ul className="font-sans">
            {scopes.map((scope) => (
              <li key={scope} className="flex flex-row text-2xl">
                - {scope}
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-8 flex w-full justify-center gap-x-4 md:justify-between">
          <Button
            onClick={() => continueInteraction({ type: 'abort' })}
            classNameVariant="bg-red-100"
          >
            <div className="font-light text-red-1200">Cancel</div>
          </Button>
          <Button
            onClick={() => continueInteraction({ type: 'confirm' })}
            variant="green"
          >
            <div className="font-light text-black">Confirm</div>
          </Button>
        </div>
        <div className="mt-8 text-sm text-gray-800">
          By clicking Confirm, you allow this app and Oauth2-Server-Redwood to
          use your information in accordance with their respective{' '}
          {client.tosUri ? (
            <a className="inline text-blue-1200" href={client.tosUri}>
              terms
            </a>
          ) : (
            <div className="inline" href={client.tosUri}>
              terms
            </div>
          )}{' '}
          and{' '}
          {client.policyUri ? (
            <a className="inline text-blue-1200" href={client.policyUri}>
              privacy policies.
            </a>
          ) : (
            <div className="inline">privacy policies.</div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Authorize
