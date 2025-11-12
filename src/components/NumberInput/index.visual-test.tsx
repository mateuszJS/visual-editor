import visualSetup from 'test/visual-setup'

describe('Number Input', () => {
  it('default', async () => {
    await visualSetup('components-numberinput--default', __dirname, 100)
  })
})
