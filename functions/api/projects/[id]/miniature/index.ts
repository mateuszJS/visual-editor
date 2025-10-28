import puppeteer from '@cloudflare/puppeteer'
import withError from '@/utils/error'
import { withSession } from '@/wrappers/session'
import * as Project from '@/types/project'
import getResponseError from '@/utils/getResponseError'

export const onRequestGet: Handler<'id'> = withSession(async (ctx, session) => {
  const [project, err] = await withError(async () => {
    const project = await ctx.env.db
      .prepare(
        `SELECT id, assets
          FROM projects
          WHERE id = ? AND owner_id = ?`
      )
      .bind(ctx.params.id, session.userId)
      .first<Pick<Project.DB, 'id' | 'assets'>>()

    return Project.sanitizeAssetsData(project)
  })

  if (err) {
    return getResponseError('Project does not exist.', 404)
  }

  console.log('get list of promises')
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
      console.log('START obtain object for url', objKey)
      const object = await ctx.env.userUploads.get(objKey)
      if (!object) return Promise.reject('Object not found')
      const stream = await object.arrayBuffer()
      console.log('END obtain object for url', objKey)
      console.log('object', object)
      console.log('object.httpMetadata', object.httpMetadata)
      return [objKey, stream] as const
    })
  console.log('Request promises')
  const results = await Promise.allSettled(uploadsList)
  const resolvedUploads = results
    .filter((res) => res.status === 'fulfilled')
    .map((res) => res.value)
  console.log('promises arrived')
  const newUrl = new URL(ctx.request.url)
  newUrl.pathname = `explore`

  const assetResponse = await ctx.env.ASSETS.fetch(new Request(newUrl.toString(), ctx.request))
  const document = await assetResponse.text()

  const browser = await puppeteer.launch(ctx.env.browser)
  const page = await browser.newPage()

  await page.setRequestInterception(true)
  page.on('request', (interceptedRequest) => {
    const url = interceptedRequest.url()
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

  await page.setContent(document)

  const img = await page.screenshot()

  await browser.close()

  return new Response(img as BodyInit, {
    headers: {
      'content-type': 'image/jpeg',
    },
  })
})
