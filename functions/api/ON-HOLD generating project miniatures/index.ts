import withError from '@/utils/error'
import { withSession } from '@/wrappers/session'
import * as Project from '@/types/project'
import getResponseError from '@/utils/getResponseError'
import { waitUntil } from 'cloudflare:workers'
import renderProject from './renderProject'

const MINIATURE_VALID_FOR = 24 * 60 * 60 * 1000

export const onRequestGet: Handler<'id'> = withSession(async (ctx, session) => {
  /* 1. Obtain last date of miniature update */
  const [metaData, metaDataErr] = await withError(() =>
    ctx.env.db
      .prepare(
        `SELECT miniature_updated_at, updated_at
          FROM projects
          WHERE id = ? AND owner_id = ?`
      )
      .bind(ctx.params.id, session.userId)
      .first<Pick<Project.DB, 'miniature_updated_at' | 'updated_at'>>()
  )

  if (!metaData || metaDataErr) {
    return getResponseError('Project does not exist.', 404)
  }

  /* 2. Verify if cached in R2 miniature is still valid,
  it's true one of the following is true:
   - there was no update after last miniature
   - last miniature was generated not more than 24h ago
   */
  const miniatureValidThreshold = new Date(Date.now() - MINIATURE_VALID_FOR).toISOString()
  const isValidMiniature =
    !!metaData.miniature_updated_at &&
    (metaData.miniature_updated_at >= metaData?.updated_at ||
      metaData.miniature_updated_at >= miniatureValidThreshold)

  /* 3. Is cached miniature is still valid, return it */
  if (isValidMiniature) {
    const obj = await ctx.env.userUploads.get(`${ctx.params.id}/miniature`)

    if (obj) {
      return new Response(obj.body, {
        headers: {
          'content-type': 'image/jpeg',
        },
      })
    }
  }

  /* 4. if miniature was not valid or not found in R2, then generate one */

  /* 5. update the miniature_updated_at to prevent multiple simultaneous requests,
  this particualr endpint is relatively expensive(browser rendering, gettign R2 object)
  + additional we use this SQL query to get project details necessary for rendering
  */
  const [project, err] = await withError(async () => {
    const project = await ctx.env.db
      .prepare(
        `UPDATE projects
          SET miniature_updated_at = ?
          WHERE id = ? AND owner_id = ?
          RETURNING id, assets`
      )
      .bind(null, ctx.params.id, session.userId)
      .first<Pick<Project.DB, 'id' | 'assets'>>()
    return Project.sanitizeAssetsData(project)
  })

  if (err) {
    console.log(err)
    return getResponseError('Project does not exist.', 404)
  }

  const [miniature, miniatureErr] = await withError(() => renderProject(project, ctx))
  if (miniatureErr) {
    console.error(miniatureErr)
    return getResponseError("I'm just a 🫖 teapot 🎀, leave me alone!", 418)
  }

  waitUntil(ctx.env.userUploads.put(`${ctx.params.id}/miniature`, miniature))

  return new Response(miniature as BodyInit, {
    headers: {
      'content-type': 'image/jpeg',
    },
  })
})
