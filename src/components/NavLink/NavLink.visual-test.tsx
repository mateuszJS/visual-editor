import visualSetup from 'test/visual-setup'

const failureThreshold = 0.04
// This component includes lots of fraction of em/rem units.
// Because of that there are mismatches randomly popping out,
// mainly because of height difference, 1-2px
// so far all of them were below 4%(including different in pixels because of font rendering on mac vs github actions)

describe('NavLink Visual Tests', () => {
  it('default', async () => {
    await visualSetup('navigation-navlink--default', __dirname, { failureThreshold })
  })

  it('active', async () => {
    await visualSetup('navigation-navlink--active', __dirname, { failureThreshold })
  })
})
