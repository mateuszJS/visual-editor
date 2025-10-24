import { render } from '@testing-library/react'
import Tooltip from './Tooltip'
import { describe, expect } from 'vitest'
import it from 'test/browser-extend'

describe('<Tooltip>', () => {
  it('should render trigger and tooltip(is hidden in CSS)', () => {
    const { container } = render(
      <Tooltip tooltipContent={<h1>Tooltip Content</h1>}>
        {(props) => <button {...props}>Trigger</button>}
      </Tooltip>
    )
    expect(container).toMatchSnapshot()
  })
})
