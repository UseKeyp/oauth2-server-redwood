import { OAuthProvider } from 'src/providers/oAuth'
import { OAuthAuthorityProvider } from 'src/providers/oAuthAuthority'
import { RedirectionProvider } from 'src/providers/redirection'
import { ToastProvider } from 'src/providers/toast'

const AllContextProviders = ({ children }) => {
  // Add additional context providers here
  // This will be automatically injected in to the App and Storybook

  return (
    <>
      <ToastProvider>
        <OAuthProvider>
          <OAuthAuthorityProvider>
            <RedirectionProvider>{children}</RedirectionProvider>
          </OAuthAuthorityProvider>
        </OAuthProvider>
      </ToastProvider>
    </>
  )
}

export default AllContextProviders
