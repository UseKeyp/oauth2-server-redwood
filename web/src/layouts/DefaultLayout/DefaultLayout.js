import { routes, Link } from '@redwoodjs/router'

const DefaultLayout = ({ children, background }) => {
  return (
    <div className={background ? background : 'chess-background'}>
      <div className="flex flex-col min-h-screen">
        <div className="flex-grow">
          <div className="max-w-7xl mx-4 sm:mx-auto px-0 sm:px-4 sm:max-w-screen">
            <header className="relative mb-8 mt-4">
              <div className="flex justify-between w-full">
                <Link to={routes.home()}>
                  <img src="/keyp-logo.png" width="40px" alt="Keyp logo" />
                </Link>
              </div>
            </header>
            <div className="mx-4 min-h-screen mb-15 md:mb-0">{children}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DefaultLayout
