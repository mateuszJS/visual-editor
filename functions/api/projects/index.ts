import generateId from '@/utils/generateId'
import * as Project from '../../types/project'
import withError from '../../utils/error'
import getResponseError from '../../utils/getResponseError'
import { withSession } from '../../wrappers/session'

export const onRequestPost = withSession(async (ctx, session) => {
  const [payload, jsonErr] = await withError(() => ctx.request.json<Project.ChangesRaw>())

  if (jsonErr) {
    return getResponseError('Invalid JSON payload.')
  }

  const [sanitizedChanges, serialErr] = await withError(() =>
    Project.sanitizeProjectPayload(payload, true)
  )

  if (serialErr) {
    return getResponseError(serialErr.message)
  }

  const [project, err] = await withError(async () => {
    const project = await ctx.env.db
      .prepare(
        `INSERT INTO projects (id, width, height, assets, owner_id)
         VALUES (?, ?, ?, ?, ?)
         RETURNING id, width, height, assets, updated_at, name`
      )
      .bind(
        generateId('project'),
        sanitizedChanges.width,
        sanitizedChanges.height,
        sanitizedChanges.assets,
        session.userId
      )
      .first<Pick<Project.DB, 'id' | 'width' | 'height' | 'assets' | 'updated_at' | 'name'>>()

    return Project.sanitizeContent(project)
  })

  if (err) {
    // console.error(err)
    return getResponseError('Failed to create a project.')
  }

  return Response.json(project, { status: 201 })
})

export const onRequestGet: Handler = withSession(async (ctx, session) => {
  const [projects, err] = await withError(async () => {
    const { results } = await ctx.env.db
      .prepare('SELECT id, name, updated_at FROM projects WHERE owner_id = ?')
      .bind(session.userId)
      .run<Pick<Project.DB, 'id' | 'name' | 'updated_at'>>()

    return results.map(Project.sanitizeMetaData)
  })

  if (err) {
    return getResponseError("Failed to fetch user's projects. " + err.message)
  }

  return Response.json(projects, { status: 200 })
})
