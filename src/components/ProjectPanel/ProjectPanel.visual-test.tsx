import visualSetup from 'test/visual-setup'

describe('<ProjectPanel /> Visual Tests', () => {
  it('default', async () => {
    // chanfed to 0.1 -> 0.2 because of different shadow rendering in github actions
    await visualSetup('projectpanel--default', __dirname, 0.2)
  })
})
