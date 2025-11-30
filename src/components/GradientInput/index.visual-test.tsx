import visualSetup from 'test/visual-setup'

describe('Gradient Input', () => {
  it('default', async () => {
    await visualSetup('components-gradientinput--default', __dirname, 0, {
      beforeTest: async (page) => {
        // Wait for potential animations to finish
        const button = await page.$('[aria-label="gradient fill"]')
        await button!.click()

        const slider = await page.$('[aria-label="Gradient components"]')
        const sliderBpx = (await slider!.boundingBox())!
        await page.mouse.click(sliderBpx.x + 5, sliderBpx.y + 30)
      },
    })
  })
})
