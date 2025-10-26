import { render } from '@testing-library/react'
import ProjectPanel from './ProjectPanel'

describe('<ProjectPanel>', () => {
  it('should render a project details link with provided text', () => {
    const { container } = render(<ProjectPanel id="0" text="project name" />)
    expect(container).toMatchSnapshot()
  })
})
