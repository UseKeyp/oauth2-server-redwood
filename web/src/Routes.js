import { Router, Route, Set, Private } from '@redwoodjs/router'

import DefaultLayout from 'src/layouts/DefaultLayout'
import AllContextProviders from 'src/providers'

const Routes = () => {
  return (
    <Router>
      <AllContextProviders>
        <Set wrap={DefaultLayout}>
          <Route path="/authorize" page={AuthorizePage} name="authorize" />
          <Route path="/" page={HomePage} name="home" />
          <Route path="/redirect/{type}" page={RedirectPage} name="redirect" />
          <Route path="/login" page={LoginPage} name="login" />
          <Route notfound page={NotFoundPage} />
          <Private unauthenticated="login">
            <Route path="/profile" page={ProfilePage} name="profile" />
          </Private>
        </Set>
      </AllContextProviders>
    </Router>
  )
}

export default Routes
