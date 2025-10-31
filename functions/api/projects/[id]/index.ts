import { withSession } from '@/wrappers/session'
import * as Project from '@/types/project'
import getResponseError from '@/utils/getResponseError'
import withError from '@/utils/error'

export const onRequestGet: Handler<'id'> = withSession(async (ctx, session) => {
  const [project, err] = await withError(async () => {
    const project = await ctx.env.db
      .prepare(
        `SELECT id, assets
          FROM projects
          WHERE id = ? AND owner_id = ?`
      )
      .bind(ctx.params.id, session.userId)
      .first<Pick<Project.DB, 'id' | 'assets' | 'updated_at'>>()

    return Project.sanitizeAssetsData(project)
  })

  if (err) {
    return getResponseError('Project does not exist.', 404)
  }

  return Response.json(project, { status: 200 })
})

export const onRequestPatch: Handler<'id'> = withSession(async (ctx, session) => {
  const [payload, jsonError] = await withError(() => ctx.request.json<Project.ChangesRaw>())

  if (jsonError) {
    return getResponseError('Invalid JSON payload.')
  }

  const [changes, changesErr] = await withError(async () =>
    Project.sanitizeProjectPayload(payload, false)
  )
  if (changesErr) {
    return getResponseError(changesErr.message)
  }

  const [updatedRow, err] = await withError(async () => {
    const columnsToUpdate = Object.keys(changes)
      .map((key) => `${key} = ?`)
      .join(', ')

    return await ctx.env.db
      .prepare(
        `UPDATE projects
          SET ${columnsToUpdate}, updated_at = CURRENT_TIMESTAMP
          WHERE id = ? AND owner_id = ?
          RETURNING id`
      )
      .bind(...Object.values(changes), ctx.params.id, session.userId)
      .first<{ id: string }>()
  })

  if (err) {
    return getResponseError('An error has occurred while updating project.', 500)
  }

  if (!updatedRow) {
    return getResponseError('Project does not exist.', 404)
  }

  return new Response(null, { status: 204 })
})
