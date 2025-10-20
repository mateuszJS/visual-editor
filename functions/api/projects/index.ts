import * as Project from '../../types/project'
import withError from '../../utils/error'
import getResponseError from '../../utils/getResponseError'
import { withSession } from '../../wrappers/session'

export const onRequestPost = withSession(async (ctx, session) => {
  const payload = await ctx.request.json<Project.ChangesRaw>()
  const [sanitizedChanges, serialErr] = await withError(() =>
    Project.sanitizeProjectPayload(payload, true)
  )

  if (serialErr) {
    return getResponseError(serialErr.message)
  }

  const [project, err] = await withError(async (): Promise<Project.MetaData> => {
    const { meta } = await ctx.env.db
      .prepare(
        `INSERT INTO projects (width, height, assets, owner_id)
         VALUES (?, ?, ?, ?)`
      )
      .bind(
        sanitizedChanges.width,
        sanitizedChanges.height,
        sanitizedChanges.assets,
        session.userId
      )
      .run()

    const project = await ctx.env.db
      .prepare('SELECT id, name, created_at, last_updated FROM projects WHERE id = ?')
      .bind(meta.last_row_id)
      .first<Pick<Project.DB, 'id' | 'name' | 'created_at' | 'last_updated'>>()

    return Project.sanitizeMetaData(project)
  })

  if (err) {
    return getResponseError('Failed to create a project. ' + err.message)
  }

  return Response.json(project, { status: 201 })
})

export const onRequestGet: SessionHandler = withSession(async (ctx, session) => {
  const [projects, err] = await withError(async () => {
    const { results } = await ctx.env.db
      .prepare('SELECT id, name, created_at, last_updated FROM projects WHERE owner_id = ?')
      .bind(session.userId)
      .run<Pick<Project.DB, 'id' | 'name' | 'created_at' | 'last_updated'>>()

    return results.map(Project.sanitizeMetaData)
  })

  if (err) {
    return getResponseError("Failed to fetch user's projects. " + err.message)
  }

  return Response.json(projects, { status: 200 })
})
