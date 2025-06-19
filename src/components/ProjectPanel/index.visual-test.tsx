import visualSetup from 'test/visual-setup'

describe('<Navigation /> Visual Tests', () => {
  it('default', async () => {
    await visualSetup('projectpanel--default', __dirname)
  })
})
