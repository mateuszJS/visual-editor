import visualSetup from 'test/visual-setup'

describe('ErrorToast Visual Tests', () => {
  it('default', async () => {
    await visualSetup('components-errortoast--default', __dirname, 600)
  })
})
