import { Router, Route, Set, Private } from '@redwoodjs/router'

import DefaultLayout from 'src/layouts/DefaultLayout'
import AllContextProviders from 'src/providers'

const Routes = () => {
  return (
    <Router>
      <AllContextProviders>
        <Set wrap={DefaultLayout}>
          <Route path="/consent" page={ConsentPage} name="consent" />
          <Route path="/" page={HomePage} name="home" />
          <Route path="/redirect/{type}" page={RedirectPage} name="redirect" />
          <Route path="/signin" page={SignInPage} name="signin" />
          <Route notfound page={NotFoundPage} />
          <Private unauthenticated="signin">
            <Route path="/profile" page={ProfilePage} name="profile" />
          </Private>
        </Set>
      </AllContextProviders>
    </Router>
  )
}

export default Routes
