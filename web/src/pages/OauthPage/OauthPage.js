import { useAuth } from '@redwoodjs/auth'
import { Link, routes, navigate } from '@redwoodjs/router'
import { MetaTags } from '@redwoodjs/web'

const OauthPage = () => {
  const { isAuthenticated, signUp } = useAuth()

  let url
  let code_challenge
  let code_challenge_method
  let client_id
  /* eslint-disable camelcase */
  let scope
  let redirect_uri
  let response_type
  let state
  let login_provider
  let action

  url = new URL(window.location.href) // Support prerender
  code_challenge = url.searchParams.get('code_challenge')
  code_challenge_method = url.searchParams.get('code_challenge_method')
  client_id = url.searchParams.get('client_id')
  scope = url.searchParams.get('scope')
  redirect_uri = url.searchParams.get('redirect_uri')
  response_type = url.searchParams.get('response_type')
  state = url.searchParams.get('state')
  action = url.pathname.split('/oauth/')[1] // eg. "authorize"
  login_provider = url.searchParams.get('login_provider') // eg. "google"

  if (action === 'authorize') {
    // Save OAuth details
    localStorage.setItem(
      'oauth',
      JSON.stringify({
        code_challenge,
        code_challenge_method,
        client_id,
        scope,
        redirect_uri,
        response_type,
        state,
        login_provider,
      })
    )
  }

  React.useEffect(() => {
    oauthProviderFlow()
  }, [])

  const oauthProviderFlow = async () => {
    if (!isAuthenticated) {
      if (login_provider) {
        const response = await signUp({ type: login_provider.toUpperCase() })
        if (response.url) {
          window.location = response.url
        } else {
          console.warn('Something went wrong')
        }
      } else {
        // If no login_provider is provided, redirect to login page
        navigate(routes.signin())
      }
    } else {
      // Complete the OAuth provider flow
    }
  }

  return (
    <>
      <MetaTags
        title="Setting up your wallet"
        description="Setting up your wallet"
      />
      <div className="flex justify-center ">
        {/* TODO: Change the loading image depending on the app's client_id */}
        <img
          src="/loading-juicebox.png"
          alt="Juicebox app logo"
          width="400px"
        />
      </div>
    </>
  )
}

export default OauthPage
