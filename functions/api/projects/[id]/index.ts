import { withSession } from '../../../wrappers/session'
import { ProjectAssets } from '../../../types/project'
import { Asset } from '../../../types/asset'
import getResponseError from '../../../utils/getResponseError'
import { getErrorMessage } from '../../../getErrorMessage'

export const onRequestGet: SessionHandler<'id'> = withSession(async (ctx, session) => {
  const projectAssets = await (async () => {
    try {
      return await ctx.env.db
        .prepare(
          `SELECT id, assets
          FROM projects
          WHERE id = ? AND owner_id = ?`
        )
        .bind(ctx.params.id, session.userId)
        .first<ProjectAssets>()
    } catch (err) {
      console.error(err)
    }
  })()

  if (!projectAssets) {
    return getResponseError('Failed to fetch project')
  }

  const assets: Asset[] = (() => {
    try {
      return JSON.parse(projectAssets.assets) as Asset[]
    } catch (err) {
      console.error(err)
    }
  })()

  if (!assets || !Array.isArray(assets)) {
    return getResponseError('Failed to fetch project')
  }

  return Response.json({ id: projectAssets.id.toString(), assets }, { status: 200 })
})

type PatchPayload = {
  width?: number
  height?: number
  assets?: Asset[]
}

type PatchSanitized = {
  width?: number
  height?: number
  assets?: string
}

// throws in case of invalid data
function sanitizeChanges(payload: PatchPayload): PatchSanitized {
  const changes: PatchSanitized = {}

  if (typeof payload.width === 'number') {
    if (payload.width < 1 || payload.width > 3000) {
      throw Error('Width of the project has to be between 1 and 3000 pixels')
    }
    changes.width = payload.width
  }

  if (typeof payload.height === 'number') {
    if (payload.height < 1 || payload.height > 3000) {
      throw Error('Height of the project has to be between 1 and 3000 pixels')
    }
    changes.height = payload.height
  }

  if (Array.isArray(payload.assets)) {
    try {
      changes.assets = JSON.stringify(payload.assets)
    } catch (err) {
      throw Error('Failed to parse assets')
    }
  }

  return changes
}

export const onRequestPatch: SessionHandler<'id'> = withSession(async (ctx, session) => {
  const payload = await ctx.request.json<PatchPayload>()

  let changes: PatchSanitized
  try {
    changes = sanitizeChanges(payload)
  } catch (err: unknown) {
    console.error(err)
    return getResponseError(getErrorMessage(err))
  }

  try {
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
      .first<ProjectAssets>()
    return new Response(null, { status: 204 })
  } catch (err) {
    console.error(err)
    return getResponseError('Failed to update project')
  }
})
