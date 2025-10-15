import visualSetup from 'test/visual-setup'

describe('<CreatorToolbox /> Visual Tests', () => {
  it('default desktop', async () => {
    await visualSetup('components-creatortoolbox--default&args=initialized%3A!true', __dirname)
  })
  it('default mobile', async () => {
    await visualSetup('components-creatortoolbox--default&args=initialized%3A!true', __dirname, {
      width: 799,
    })
  })
})
