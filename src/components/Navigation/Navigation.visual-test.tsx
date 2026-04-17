import visualSetup from 'test/visual-setup'

describe('<Navigation /> Visual Tests', () => {
  it('default', async () => {
    await visualSetup('navigation-navigation--default', __dirname, 400, {
      width: 600,
    })
  })
})
