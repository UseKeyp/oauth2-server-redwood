import { useToast } from 'src/providers/toast'

const OAuthAuthorityContext = React.createContext({
  isLoading: true,
})

const parseUrl = () => {
  let url = new URL(window.location.href) // Support prerender
  return { interactionUid: url.searchParams.get('uid') }
}

const OAuthAuthorityProvider = ({ children }) => {
  const { toast } = useToast()

  const INTERACTION_UID_LOCAL_KEY = 'interactionUid'

  const saveInteraction = () => {
    const { interactionUid } = parseUrl()
    if (interactionUid)
      localStorage.setItem(INTERACTION_UID_LOCAL_KEY, interactionUid)
  }

  const continueInteraction = async ({ type }) => {
    try {
      if (!['login', 'confirm'].includes(type))
        throw 'Invalid type for continueInteraction'
      const interactionUid = localStorage.getItem(INTERACTION_UID_LOCAL_KEY)
      const response = await fetch(
        `/oauth/interaction/${interactionUid}/${type}`,
        { method: 'POST' }
      ).then((res) => {
        if (![200, 202, 302, 303].includes(res.status))
          throw new Error('Error contacting the OAuth server')
        return res.json()
      })
      window.location.replace(response.redirectTo)
    } catch (error) {
      toast.error(error?.message)
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
