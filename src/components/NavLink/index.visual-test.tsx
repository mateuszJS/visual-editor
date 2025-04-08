import visualSetup from 'test/visual-setup'

describe('NavLink Visual Tests', () => {
  it('default', async () => {
    await visualSetup('navigation-navlink--default', __dirname)
  })

  it('active', async () => {
    await visualSetup('navigation-navlink--active', __dirname)
  })
})
