import { useToast } from 'src/providers/toast'

const OAuthAuthorityContext = React.createContext({
  isLoading: true,
})

const OAuthAuthorityProvider = ({ children }) => {
  const { toast } = useToast()

  const getInteractionUid = () => {
    let url = new URL(window.location.href)
    const uid = url.searchParams.get('uid')
    // if (!uid) throw 'Error getting interactionUid from URL'
    return uid
  }

  const continueInteraction = async ({ type, userId, uid }) => {
    try {
      let interactionUid = uid
      if (!interactionUid) interactionUid = getInteractionUid()
      if (!interactionUid) throw 'No uid for continueInteraction'
      if (!['login', 'confirm', 'abort'].includes(type))
        throw 'Invalid type for continueInteraction'
      const url = `${global.RWJS_API_URL}/oauth/interaction/${interactionUid}/${type}`
      if (type === 'abort') return window.location.replace(url)
      const response = await fetch(url, {
        method: 'POST',
        ...(userId && {
          headers: {
            'auth-provider': 'dbAuth',
            authorization: `Bearer ${userId}`,
          },
        }),
      }).then((res) => {
        if (![200, 202, 302, 303].includes(res.status))
          throw new Error('Error contacting the OAuth server')
        return res.json()
      })
      window.location.replace(response.redirectTo)
    } catch (error) {
      console.log(error)
      toast.error(error?.message)
      return { error: error.message }
    }
  }

  return (
    <OAuthAuthorityContext.Provider
      value={{
        getInteractionUid,
        continueInteraction,
      }}
    >
      {children}
    </OAuthAuthorityContext.Provider>
  )
}

const useOAuthAuthority = () => React.useContext(OAuthAuthorityContext)

export { OAuthAuthorityProvider, useOAuthAuthority }
