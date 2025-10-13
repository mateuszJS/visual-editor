import fs from 'fs'
import path from 'path'
import 'jest-puppeteer'
import 'expect-puppeteer'
import { toMatchImageSnapshot } from 'jest-image-snapshot'

expect.extend({ toMatchImageSnapshot })

/* to filter out unnecessary console logs from visual regression tests */
const knownTrashConsoleLogs = [
  '%cDownload the React DevTools for a better development experience: https://react.dev/link/react-devtools font-weight:bold',
  'Failed to load resource: the server responded with a status of 404 (Not Found)',
]

beforeAll(async () => {
  page.on('console', (msg) => {
    const text = msg.text()
    if (!knownTrashConsoleLogs.includes(text)) {
      console.log('BROWSER CONSOLE:', text)
    }
  })
  await page.setViewport({ width: 1280, height: 720 })
  await page.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: 'dark' }])
}, 20000)

/**
 * Visual setup for Storybook stories
 * @param storyId - Storybook story ID takend from storbyook iframe URL
 */
export default async function visualSetup(
  storyId: string,
  dirname: string,
  options: { colorThreshold?: number; failureThreshold?: number; width?: number } = {}
) {
  const { colorThreshold = 0.1, failureThreshold = 0.013 } = options

  if (options.width) {
    await page.setViewport({ width: options.width, height: 720 })
  }

  // Create screenshots directory
  const screenshotsDir = path.join(dirname, '__image_snapshots__')
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true })
  }

  await page.goto(
    `http://localhost:6006/iframe.html?globals=backgrounds.value%3A!hex(111)&args=&id=${storyId}&viewMode=story`,
    {
      waitUntil: 'networkidle0',
    }
  )

  // TODO: find a better solution which avoid storign two screenshots and removing one
  const tempPath = path.join(screenshotsDir, 'temp-screenshot.png')
  // currently both puppetieer and toMatchImageSnapshot stores own screenshots
  const storyRoot = await page.$('#storybook-root')

  if (!storyRoot) {
    throw new Error('Element with class #storybook-root not found')
  }
  await storyRoot.screenshot({ path: tempPath })
  // storybook-root
  // await page.screenshot({ path: tempPath });
  const imageBuffer = fs.readFileSync(tempPath)

  // Compare with baseline
  try {
    // Compare with baseline
    expect(imageBuffer).toMatchImageSnapshot({
      customSnapshotsDir: screenshotsDir,
      failureThreshold,
      failureThresholdType: 'percent',
      allowSizeMismatch: true, // Elements which use fractions of rem/em units can have different size on different machines by 1-2px
      updatePassedSnapshot: true, // allows to update screenshots when -u flag is passed(flag ot update snapshots)
      customSnapshotIdentifier: expect
        .getState()
        .currentTestName?.replace(/\//g, '')
        .replace(/\s/g, '_'),
      customDiffConfig: {
        threshold: colorThreshold,
      },
    })
  } finally {
    // Clean up temporary file
    if (fs.existsSync(tempPath)) {
      fs.unlinkSync(tempPath)
    }

    if (options.width) {
      await page.setViewport({ width: 1280, height: 720 })
    }
  }
}
