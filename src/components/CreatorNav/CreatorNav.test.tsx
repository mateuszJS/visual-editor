import CreatorNav from './CreatorNav'
import { render } from '@testing-library/react'

describe('<CreatorNav />', () => {
  it('should render navigation items', () => {
    const { container } = render(<CreatorNav />)

    expect(container).toMatchSnapshot()
  })
})
