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

  const uploadsList = project.assets
    .map((asset) => {
      if ('url' in asset && typeof asset.url === 'string') {
        // /api/project-uploads/1/f37825dd-c3f0-4d97-b444-1d524ccec678
        return asset.url
      }
    })
    .filter(Boolean)
    .map(async (assetUrl) => {
      console.log('start - asset.url', assetUrl)
      const objKey = assetUrl.replace('/api/project-uploads/', '')
      const object = await ctx.env.userUploads.get(objKey)
      console.log('end - assetUrl', assetUrl)
      if (!object) return undefined
      // /api/project-uploads/1/f37825dd-c3f0-4d97-b444-1d524ccec678
      return [assetUrl, object]
    })

  const results = await Promise.allSettled(uploadsList)
  const resolvedUploads = results.filter((res) => res.status === 'fulfilled')

  const newUrl = new URL(ctx.request.url)
  newUrl.pathname = `explore`

  console.log('ctx.request', newUrl.toString())
  const assetResponse = await ctx.env.ASSETS.fetch(new Request(newUrl.toString(), ctx.request))
  const document = await assetResponse.text()

  const browser = await puppeteer.launch(ctx.env.browser)
  const page = await browser.newPage()

  await page.setRequestInterception(true)
  page.on('request', (interceptedRequest) => {
    if (interceptedRequest.url().endsWith('.png') || interceptedRequest.url().endsWith('.jpg'))
      interceptedRequest.abort()
    else interceptedRequest.continue()
  })

  await page.setContent(document)

  // const url = 'https://magic-render.space/'
  // await page.goto(url)
  const img = await page.screenshot()

  await browser.close()

  return new Response(img as BodyInit, {
    headers: {
      'content-type': 'image/jpeg',
    },
  })
})
