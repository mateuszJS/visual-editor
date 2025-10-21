import { withSession } from '../../../wrappers/session'
import * as Project from '../../../types/project'
import getResponseError from '../../../utils/getResponseError'
import withError from '../../../utils/error'

export const onRequestGet: SessionHandler<'id'> = withSession(async (ctx, session) => {
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
    return getResponseError('Failed to fetch project. ' + err.message)
  }

  return Response.json(project, { status: 200 })
})

export const onRequestPatch: SessionHandler<'id'> = withSession(async (ctx, session) => {
  const payload = await ctx.request.json<Project.ChangesRaw>()

  const [, err] = await withError(async () => {
    const changes = await Project.sanitizeProjectPayload(payload, false)
    const columnsToUpdate = Object.keys(changes)
      .map((key) => `${key} = ?`)
      .join(', ')

    await ctx.env.db
      .prepare(
        `UPDATE projects
          SET ${columnsToUpdate}
          WHERE id = ? AND owner_id = ?`
      )
      .bind(...Object.values(changes), ctx.params.id, session.userId)
      .run()
  })

  if (err) {
    return getResponseError('Failed to update project. ' + err.message)
  }

  return new Response(null, { status: 204 })
})
