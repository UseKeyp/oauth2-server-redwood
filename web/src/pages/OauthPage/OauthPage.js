import { MetaTags } from '@redwoodjs/web'

import { useOAuthAuthority } from 'src/providers/oAuthAuthority'

const OauthPage = ({ action }) => {
  const { authorize } = useOAuthAuthority()

  React.useEffect(() => {
    oauthProviderFlow()
  }, [])

  const oauthProviderFlow = async () => {
    if (action === 'authorize') authorize()
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