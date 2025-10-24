import { describe, expect } from 'vitest'
import CreatorNav from './CreatorNav'
import { render } from '@testing-library/react'
import it from 'test/browser-extend'

describe('<CreatorNav />', () => {
  it('should render navigation items', () => {
    const { container } = render(<div />)
    console.log('CreatorNav', CreatorNav)
    expect(1).toMatchSnapshot(2)
  })
})
// import { describe, expect } from 'vitest'
// import CreatorNav from './CreatorNav'
// import { render } from '@testing-library/react'
// import it from 'test/browser-extend'

// describe('<CreatorNav />', () => {
//   it('should render navigation items', () => {
//     const { container } = render(<CreatorNav />)

//     expect(container).toMatchSnapshot()
//   })
// })
