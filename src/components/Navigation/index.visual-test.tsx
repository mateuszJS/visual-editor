import visualSetup from '@/test-utils/visual-setup'

describe('<Navigation /> Visual Tests', () => {
  it('default', async () => {
    await visualSetup('navigation-wrapper--default', __dirname)
  })
})
