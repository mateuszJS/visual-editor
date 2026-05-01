import * as Template from '../../types/template'
import withError from '../../utils/error'
import getResponseError from '../../utils/getResponseError'

export const onRequestGet: Handler = async (ctx) => {
  const [projects, err] = await withError(async () => {
    const { results } = await ctx.env.db
      .prepare(
        `
        SELECT id, name, preview_shape, created_at
        FROM templates`
      )
      .run<Pick<Template.DB, 'id' | 'name' | 'preview_shape' | 'created_at'>>()

    return results.map(Template.sanitizeMetaData)
  })

  if (err) {
    return getResponseError("Failed to fetch user's projects. " + err.message)
  }

  return Response.json(projects, { status: 200 })
}
