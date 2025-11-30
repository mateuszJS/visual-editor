import visualSetup from 'test/visual-setup'

describe('<ProjectPanel /> Visual Tests', () => {
  it('default', async () => {
    await visualSetup('components-projectpanel--default', __dirname, 500)
  })
})
