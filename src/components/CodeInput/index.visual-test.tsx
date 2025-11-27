import visualSetup from 'test/visual-setup'

describe('Code Input', () => {
  it('default', async () => {
    await visualSetup('components-codeinput--default', __dirname, 0, {
      beforeTest: async (page) => {
        const labelEl = await page.$('[aria-label="Open code editor"]')
        await labelEl!.click()
      },
    })
  })
})
