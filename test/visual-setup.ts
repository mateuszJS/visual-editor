import fs from 'fs'
import path from 'path'
import 'jest-puppeteer'
import 'expect-puppeteer'
import { toMatchImageSnapshot } from 'jest-image-snapshot'

expect.extend({ toMatchImageSnapshot })

beforeAll(async () => {
  page.on('console', (msg) => console.log('BROWSER CONSOLE:', msg.text()))
  await page.setViewport({ width: 1280, height: 720 })
  await page.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: 'dark' }])
}, 20000)

/**
 * Visual setup for Storybook stories
 * @param storyId - Storybook story ID takend from storbyook iframe URL
 */
export default async function visualSetup(storyId: string, dirname: string) {
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
      failureThreshold: 0.02,
      failureThresholdType: 'percent',
      updatePassedSnapshot: false /* change to true to update this screenhot */,
      customSnapshotIdentifier: storyId,
    })
  } finally {
    // Clean up temporary file
    if (fs.existsSync(tempPath)) {
      fs.unlinkSync(tempPath)
    }
  }
}
