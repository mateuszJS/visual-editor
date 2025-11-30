import { render } from '@testing-library/react'
import Tooltip from './Tooltip'

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
