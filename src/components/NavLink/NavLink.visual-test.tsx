import visualSetup from 'test/visual-setup'

describe('NavLink Visual Tests', () => {
  it('default', async () => {
    await visualSetup('navigation-navlink--default', __dirname, 80)
  })

  it('active', async () => {
    await visualSetup('navigation-navlink--active', __dirname, 110)
  })
})
