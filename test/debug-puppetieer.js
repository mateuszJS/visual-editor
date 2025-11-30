// you can run this file in case if only during screenshot testing
// something looks different from storybook
// it might be because of chrome version, in this case
// install puppeteer again to fetch newest version

import puppeteer from 'puppeteer'

// Launch the browser and open a new blank page.
;(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    devtools: true,
  })
  const page = await browser.newPage()
  await page.setViewport({ width: 1280, height: 720 })
  await page.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: 'dark' }])

  // Navigate the page to a URL.
  const storyId = 'components-rangeslider--default'
  await page.goto(
    `http://localhost:6006/iframe.html?globals=backgrounds.value%3A!hex(111)&args=&id=${storyId}&viewMode=story`,
    {
      waitUntil: 'networkidle0',
    }
  )

  debugger

  // const resultsSelector = '.gsc-table-result a.gs-title[href]'
  // await page.waitForSelector(resultsSelector)

  console.log('Browser is open. Press Ctrl+C to exit.')
  // Keep the process alive forever
  await new Promise(() => {})

  // await browser.close()
})()
