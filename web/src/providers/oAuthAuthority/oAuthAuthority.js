import { useMutation } from '@apollo/client'

import { useAuth } from '@redwoodjs/auth'
import { routes, navigate } from '@redwoodjs/router'

import { OAUTH_AUTHORITY_AUTHORIZE } from './graphql'

const OAuthAuthorityContext = React.createContext({
  isLoading: true,
})

const parseUrl = () => {
  const url = new URL(window.location.href) // Support prerender
  return {
    code_challenge: url.searchParams.get('code_challenge'),
    code_challenge_method: url.searchParams.get('code_challenge_method'),
    client_id: url.searchParams.get('client_id'),
    scope: url.searchParams.get('scope'),
    redirect_uri: url.searchParams.get('redirect_uri'),
    response_type: url.searchParams.get('response_type'),
    state: url.searchParams.get('state'),
    login_provider: url.searchParams.get('login_provider'), // eg. "google"
  }
}

const OAuthAuthorityProvider = ({ children }) => {
  const [state, setState] = React.useState({})

  const { getCurrentUser, signUp } = useAuth()

  const [oAuthAuthorizeMutation] = useMutation(OAUTH_AUTHORITY_AUTHORIZE)

  const authorize = async () => {
    try {
      // Get oauth details, either from URL or local storage
      let oAuthData = localStorage.getItem('oauth')
      localStorage.removeItem('oauth')
      if (oAuthData) {
        oAuthData = JSON.parse(oAuthData)
      } else {
        if (!oAuthData) oAuthData = parseUrl()
      }
      // TODO: Possible speed improvements here. isAuthenticated doesn't seem to work but could be faster?
      const currentUser = await getCurrentUser()

      // Handle not logged in user
      if (!currentUser) {
        console.log('User is not authenticated')
        localStorage.setItem('oauth', JSON.stringify(oAuthData))
        if (oAuthData.login_provider) {
          // Automatically navigate the user to the correct social login provider
          const response = await signUp({
            type: oAuthData.login_provider.toUpperCase(),
          })
          if (response.url) {
            return (window.location = response.url)
          } else {
            return console.warn('Something went wrong')
          }
        } else {
          // If no login_provider is provided, redirect to login page
          return navigate(routes.signin())
        }
      }

      // Submit authorization
      const { data } = await oAuthAuthorizeMutation({ variables: oAuthData })
      const { oAuthAuthorize } = data

      // Prompt for authorization permissions

      // Redirect back to the app
      if (oAuthAuthorize.url) {
        window.location = oAuthAuthorize.url
      } else {
        const errorMessage = 'Something went wrong'
        setState({ isLoading: false, error: errorMessage })
        return { error: errorMessage }
      }
    } catch (error) {
      setState({ isLoading: false, error: error.message })
      return { error: error.message }
    }
  }

  return (
    <OAuthAuthorityContext.Provider
      value={{
        isLoading: state.isLoading,
        error: state.error,
        authorize,
      }}
    >
      {children}
    </OAuthAuthorityContext.Provider>
  )
}

const useOAuthAuthority = () => React.useContext(OAuthAuthorityContext)

export { OAuthAuthorityProvider, useOAuthAuthority }
