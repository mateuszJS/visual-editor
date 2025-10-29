import puppeteer from '@cloudflare/puppeteer'
import { waitUntil } from 'cloudflare:workers'
import * as Project from '@/types/project'

export default async function renderProject(
  project: Project.AssetsData,
  ctx: EventContext<Env, never, never>
) {
  /* 6. Collect all assets though R2 binding instead of more expensive
  requests from puppeteer */
  // console.log('get list of promises')
  const uploadsList = project.assets
    .map((asset) => {
      if ('url' in asset && typeof asset.url === 'string') {
        // /api/project-uploads/1/f37825dd-c3f0-4d97-b444-1d524ccec678
        return '5/img-sample' // asset.url
      }
    })
    .filter(Boolean)
    .map(async (assetUrl) => {
      const objKey = assetUrl.replace('/api/project-uploads/', '')
      // console.log('START obtain object for url', objKey)
      const object = await ctx.env.userUploads.get(objKey)
      if (!object) return Promise.reject('Object not found')
      const stream = await object.arrayBuffer()
      // console.log('END obtain object for url', objKey)
      // console.log('object', object)
      // console.log('object.httpMetadata', object.httpMetadata)
      return [objKey, stream] as const
    })
  // console.log('Request promises')

  const results = await Promise.allSettled(uploadsList)
  const resolvedUploads = results
    .filter((res) => res.status === 'fulfilled')
    .map((res) => res.value)
  // console.log('promises arrived')
  const newUrl = new URL(ctx.request.url)
  newUrl.pathname = 'raw-render'

  const assetResponse = await ctx.env.ASSETS.fetch(new Request(newUrl.toString(), ctx.request))
  const document = await assetResponse.text()

  const browser = await puppeteer.launch(ctx.env.browser)
  const page = await browser.newPage()

  await page.setRequestInterception(true)
  console.log('Set request interception')

  page.on('console', (msg) => {
    const text = msg.text()
    console.log('BROWSER CONSOLE:', text)
  })

  page.on('request', (interceptedRequest) => {
    const url = interceptedRequest.url()
    console.log('Intercepted request for', url)

    if (url.endsWith('api/projects/placeholder-project-id')) {
      interceptedRequest.respond({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(project),
      })
    }

    const match = resolvedUploads.find(([pathname]) => url.endsWith(pathname))

    if (!match) {
      interceptedRequest.continue()
      return
    }

    const [matchObject, buffer] = match

    if (matchObject) {
      interceptedRequest.respond({
        status: 200,
        contentType: 'image/png',
        body: new Uint8Array(buffer), // stream, // matchObject.body,
      })
    } else {
      interceptedRequest.continue()
    }
  })
  console.log('document', document)
  await page.setContent(document, {
    waitUntil: ['domcontentloaded', 'load', 'networkidle0', 'networkidle2'],
    timeout: 30000,
  })

  page.on('console', (msg) => {
    const text = msg.text()
    console.log('BROWSER CONSOLE:', text)
  })

  const img = await page.screenshot()

  waitUntil(browser.close())

  return img
}
