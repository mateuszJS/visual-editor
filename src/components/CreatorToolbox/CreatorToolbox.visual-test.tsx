import visualSetup from 'test/visual-setup'

describe('<CreatorToolbox /> Visual Tests', () => {
  it('default desktop', async () => {
    await visualSetup('components-creatortoolbox--default&args=initialized%3A!true', __dirname, 20)
  })
  it('default mobile', async () => {
    await visualSetup(
      'components-creatortoolbox--default&args=initialized%3A!true',
      __dirname,
      250,
      {
        width: 799,
      }
    )
  })
})
