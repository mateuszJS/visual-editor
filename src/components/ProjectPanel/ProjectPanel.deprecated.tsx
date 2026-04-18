// jest on local env doesn't render in snapshtos anchor styles but does in github actions

import { render, waitFor } from '@testing-library/react'
import ProjectPanel from './ProjectPanel'

describe('<ProjectPanel>', () => {
  it('should render a project details link with provided text', async () => {
    const { container } = render(<ProjectPanel id="0" text="project name" />)

    await waitFor(() => expect(container).toMatchSnapshot())
  })
})
