import { useAuth } from '@redwoodjs/auth'
import { routes, Link } from '@redwoodjs/router'

const DefaultLayout = ({ children, background }) => {
  const { isAuthenticated, logOut } = useAuth()
  return (
    <div className={background ? background : 'chess-background'}>
      <div className="flex min-h-screen flex-col">
        <div className="flex-grow">
          <div className="sm:max-w-screen mx-4 max-w-7xl px-0 sm:mx-auto sm:px-4">
            <header className="relative mb-8 mt-4 w-full">
              <div>
                <Link to={routes.home()}>OAuth2 Server Redwood</Link>
              </div>
              <div>
                {isAuthenticated ? (
                  <button onClick={logOut}>Log Out</button>
                ) : (
                  <Link to={routes.login()}>Sign In</Link>
                )}
              </div>
            </header>
            <div className="mb-15 mx-4 min-h-screen md:mb-0">{children}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DefaultLayout
