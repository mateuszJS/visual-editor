import visualSetup from 'test/visual-setup'

describe('Range Slider', () => {
  it('default', async () => {
    await visualSetup('components-rangeslider--default', __dirname, 100)
  })
})
