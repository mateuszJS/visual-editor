import visualSetup from 'test/visual-setup'

describe('ErrorToast Visual Tests', () => {
  it('default', async () => {
    await visualSetup('errortoast--default', __dirname)
  })
})
