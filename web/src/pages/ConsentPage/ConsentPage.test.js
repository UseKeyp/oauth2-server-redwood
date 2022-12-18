import { render } from '@redwoodjs/testing/web'

import ConsentPage from './ConsentPage'

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('ConsentPage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<ConsentPage />)
    }).not.toThrow()
  })
})
