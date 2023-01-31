import { navigate, routes } from '@redwoodjs/router'
import { MetaTags } from '@redwoodjs/web'

import { useRedirection } from 'src/providers/redirection'

const Redirect = ({ type }) => {
  const { errorMessage, successMessage, isLoading } = useRedirection()

  const url = new URL(window.location.href)
  const state = decodeURIComponent(url.searchParams.get('state'))
  let uid = state.split(":")[1];

  if (!uid && (errorMessage === 'End-User aborted interaction' || errorMessage === 'The resource owner or authorization server denied the request')) {
    navigate(routes.home())
  }

  if (uid && errorMessage) {
    const url = `/oauth/interaction/${uid}/abort`
    window.location.replace(url)
  }

  if (isLoading)
    return (
      <div className="flex min-h-screen min-w-full items-center justify-center">
        Loading...
      </div>
    )

  let callToAction
  if (['chess', 'node_oidc', 'discord'].includes(type)) {
    if (successMessage) {
      callToAction = (
        <button
          to={routes.profile()}
          className="text-s mt-6"
          size="large"
          color="green"
        >
          See Profile
        </button>
      )
    } else {
      callToAction = (
        <button
          onClick={() => navigate(routes.login())}
          className="text-s mt-6"
          size="large"
          color="green"
        >
          Try again
        </button>
      )
    }
  }
  return (
    <div className="chess-background flex min-h-screen flex-col">
      <div className="align-center flex w-full flex-grow flex-col items-center justify-center">
        <div className="redirect-container w-80 sm:w-96">
          <div className="redirect-contents w-full">
            <div
              className={`align-center flex rounded-lg border-2 bg-black p-4 border-${
                successMessage ? `green` : `[#FFBB0D]`
              }`}
            >
              <h3>{type}</h3>
            </div>
            <div className="mt-6 tracking-tight">
              {successMessage}
              {typeof errorMessage === 'string' ? (
                <>
                  <h2 className="mt-6 tracking-tight">
                    Oops - there was an issue
                  </h2>
                  <h3 className="text-errorYellow mt-8 font-bold">
                    {errorMessage.substring(0, 200)}
                  </h3>
                </>
              ) : null}
            </div>
            {callToAction || (
              <p className="mt-8 ">You will be redirected shortly</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

const RedirectPage = ({ type, error }) => {
  return (
    <>
      <MetaTags title="Redirect" />
      <Redirect type={type} error={error} />
    </>
  )
}

export default RedirectPage
