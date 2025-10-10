import visualSetup from 'test/visual-setup'

describe('<CreatorToolbox /> Visual Tests', () => {
  it('loading', async () => {
    await visualSetup('creatortoolbox--default&args=initialized%3A!false', __dirname)
  })
  it('default desktop', async () => {
    await visualSetup('creatortoolbox--default&args=initialized%3A!true', __dirname)
  })
  it('default mobile', async () => {
    await visualSetup('creatortoolbox--default&args=initialized%3A!true', __dirname, { width: 799 })
  })
})
