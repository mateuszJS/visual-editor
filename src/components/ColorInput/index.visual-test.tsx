import visualSetup from 'test/visual-setup'

describe('Color Input', () => {
  it('default', async () => {
    await visualSetup('components-colorinput--default', __dirname, 300, {
      beforeTest: async (page) => {
        // Wait for potential animations to finish
        const labelEl = await page.$('label')
        await labelEl!.click()

        const colorSpectrum = await page.$('[aria-label="Color"]')
        const colorSpectrumBox = (await colorSpectrum!.boundingBox())!
        await page.mouse.click(colorSpectrumBox.x + 170, colorSpectrumBox.y + 30)

        const hue = await page.$('[aria-label="Hue"]')
        const hueBox = (await hue!.boundingBox())!
        await page.mouse.click(hueBox.x + 140, hueBox.y + 10)

        const alpha = await page.$('[aria-label="Alpha"]')
        const alphaBox = (await alpha!.boundingBox())!
        await page.mouse.click(alphaBox.x + 120, alphaBox.y + 10)
      },
    })
  })
})
