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

  const browser = await puppeteer.launch(ctx.env.browser)
  const page = await browser.newPage()
  const url = 'https://magic-render.space/'
  await page.goto(url)
  const img = await page.screenshot()
  // await ctx.env.BROWSER_KV_DEMO.put(url, img, {
  //   expirationTtl: 60 * 60 * 24,
  // });
  await browser.close()

  return new Response(img as BodyInit, {
    headers: {
      'content-type': 'image/jpeg',
    },
  })
})
