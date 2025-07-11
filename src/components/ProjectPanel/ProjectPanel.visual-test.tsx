import visualSetup from 'test/visual-setup'

describe('<ProjectPanel /> Visual Tests', () => {
  it('default', async () => {
    await visualSetup('projectpanel--default', __dirname)
  })
})
