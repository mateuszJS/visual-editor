import { Asset } from '../../types/asset'
import { ProjectMeta } from '../../types/project'
import getResponseError from '../../utils/getResponseError'
import { withSession } from '../../wrappers/session'

type Data = {
  width: number
  height: number
  assets: Asset[]
}

export const onRequestPost = withSession(async (ctx, session) => {
  const { width, height, assets } = await ctx.request.json<Data>()

  if (width < 1 || width > 3000) {
    return getResponseError('Width of the project has to be between 1 and 3000 pixels')
  }

  if (height < 1 || height > 3000) {
    return getResponseError('Height of the project has to be between 1 and 3000 pixels')
  }

  let assetStringified = '[]'
  if (assets) {
    try {
      assetStringified = JSON.stringify(assets)
    } catch (err) {
      return getResponseError('Failed to parse assets')
    }
  }

  const project = await (async () => {
    try {
      const { meta } = await ctx.env.db
        .prepare(
          `INSERT INTO projects (width, height, owner_id, assets)
         VALUES (?, ?, ?, ?)`
        )
        .bind(1, 1, session.userId, assetStringified)
        .run()

      return await ctx.env.db
        .prepare('SELECT id, name, created_at, last_updated FROM projects WHERE id = ?')
        .bind(meta.last_row_id)
        .first<ProjectMeta>()
    } catch (err) {
      console.error(err)
    }
  })()

  if (!project) {
    return getResponseError('Failed to create project')
  }

  return Response.json(
    {
      ...project,
      id: project.id.toString(),
    },
    { status: 201 }
  )
})

export const onRequestGet: SessionHandler = withSession(async (ctx, session) => {
  const projects = await (async () => {
    try {
      const { results } = await ctx.env.db
        .prepare('SELECT id, name, created_at, last_updated FROM projects WHERE owner_id = ?')
        .bind(session.userId)
        .run<ProjectMeta>()

      return results
    } catch (err) {
      console.error(err)
    }
  })()

  if (!projects) {
    return getResponseError("Failed to fetch user's projects")
  }

  return Response.json(
    projects.map((project) => ({ ...project, id: project.id.toString() })),
    { status: 200 }
  )
})
