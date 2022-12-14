import { useEffect } from 'react'

import { useAuth } from '@redwoodjs/auth'
import {
  useParams,
  // navigate,
  // routes
} from '@redwoodjs/router'
import { MetaTags } from '@redwoodjs/web'

import { useOAuthAuthority } from 'src/providers/oAuthAuthority'
import { saveRedirectTo } from 'src/providers/redirection'
import { useToast } from 'src/providers/toast'

const LoginPortal = () => {
  const { signUp, isAuthenticated, reauthenticate } = useAuth()
  const { getInteractionUid } = useOAuthAuthority()

  const { error, redirectTo } = useParams()
  const { toast } = useToast()
  const [errorText, setErrorText] = React.useState('')
  const getErrorText = (error) => {
    if (error === 'expired') return `Session expired, please log in again.`
  }

  const onSubmitSignUp = async (type) => {
    const interactionUid = getInteractionUid()
    const response = await signUp({ type, stateExtraData: interactionUid })
    if (response.url) {
      window.location = response.url
    } else {
      toast.error('Something went wrong')
    }
  }

  // useEffect(() => {
  //   if (redirectTo) {
  //     saveRedirectTo(redirectTo) && reauthenticate()
  //   }
  // }, [redirectTo, reauthenticate])

  useEffect(() => {
    error && setErrorText(getErrorText(error))
  }, [error])

  useEffect(() => {
    // if (isAuthenticated) {
    //   navigate(routes.profile())
    // }
  }, [isAuthenticated])

  const getButton = (type, text) => (
    <button
      onClick={() => onSubmitSignUp(type)}
      className="login-button mt-2"
      size="small"
    >
      <div className="flex justify-center align-center items-center m-1">
        <span className="mr-2">{text}</span>
      </div>
    </button>
  )

  return (
    <div className="flex justify-center">
      <div className="login-portal-container w-80 sm:w-96">
        <h1 className="text-2xl tracking-tight font-extrabold text-gray-900 sm:text-3xl md:text-4xl">
          <span className="block xl:inline">Oauth2 Server Redwood</span>
        </h1>
        <div className="mt-6">
          <div className="mb-2">
            <h3 className="text-base font-bold color-grey-light text-center">
              Sign in
            </h3>
          </div>
        </div>

        <div className="login-portal-container--button-wrapper">
          {getButton('NODE_OIDC', 'oidc-provider')}
          <br />
          {getButton('DISCORD', 'Discord')}
          <br />
          {errorText && <div className="mt-2 rw-cell-error">{errorText}</div>}
        </div>
        <div className="w-full text-center"></div>
        <h4 className="mt-6">
          <a className="mr-2 text-blue" href="/">
            Terms of Service
          </a>
          ??
          <a className="ml-2 text-blue" href="/">
            Privacy Policy
          </a>
        </h4>
      </div>
    </div>
  )
}

const LoginPage = () => {
  return (
    <>
      <MetaTags title="Sign In" description="Join to start collecting." />
      <LoginPortal />
    </>
  )
}

export default LoginPage
