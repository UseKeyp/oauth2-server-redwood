const OAuthAuthorityContext = React.createContext({
  isLoading: true,
})

const parseUrl = () => {
  let url = new URL(window.location.href) // Support prerender
  return { interactionUid: url.searchParams.get('uid') }
}

const OAuthAuthorityProvider = ({ children }) => {
  const INTERACTION_UID_LOCAL_KEY = 'interactionUid'

  const saveInteraction = () => {
    const { interactionUid } = parseUrl()
    if (interactionUid)
      localStorage.setItem(INTERACTION_UID_LOCAL_KEY, interactionUid)
  }

  const continueInteraction = async () => {
    try {
      const interactionUid = localStorage.getItem(INTERACTION_UID_LOCAL_KEY)
      await fetch(`/oauth/interaction/${interactionUid}/login`, {
        method: 'POST',
      })
    } catch (error) {
      return { error: error.message }
    }
  }

  return (
    <OAuthAuthorityContext.Provider
      value={{
        saveInteraction,
        continueInteraction,
      }}
    >
      {children}
    </OAuthAuthorityContext.Provider>
  )
}

const useOAuthAuthority = () => React.useContext(OAuthAuthorityContext)

export { OAuthAuthorityProvider, useOAuthAuthority }
