import { render } from '@redwoodjs/testing/web'

import AuthorizePage from './AuthorizePage'

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('AuthorizePage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<AuthorizePage />)
    }).not.toThrow()
  })
})
