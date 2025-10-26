import visualSetup from 'test/visual-setup'

describe('<ProjectPanel /> Visual Tests', () => {
  it('default', async () => {
    // changed to 0.1 -> 0.2 because of different shadow rendering in github actions
    await visualSetup('components-projectpanel--default', __dirname)
  })
})
