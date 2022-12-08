import { render } from '@redwoodjs/testing/web'

import OauthPage from './OauthPage'

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('OauthPage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<OauthPage />)
    }).not.toThrow()
  })
})
