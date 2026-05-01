import { withSession } from '@/wrappers/session'
import * as Project from '@/types/project'
import getResponseError from '@/utils/getResponseError'
import withError from '@/utils/error'
import generateId from '@/utils/generateId'
import * as z from 'zod'

const Payload = z.object({
  name: z.string().nonempty(),
  previewShape: z.literal(['SQUARE', 'L', '2v', '3v', '2h', '3h']),
})

export const onRequestPost: Handler<'id'> = withSession(
  async (ctx) => {
    const [project, projectErr] = await withError(async () => {
      const project = await ctx.env.db
        .prepare(
          `SELECT assets, width, height
          FROM projects
          WHERE id = ?`
        )
        .bind(ctx.params.id)
        .first<Pick<Project.DB, 'assets' | 'width' | 'height'>>()

      return project
    })

    if (projectErr || !project) {
      console.error(1, projectErr)
      return getResponseError('Failed to fetch the project.')
    }

    const [payload, payloadErr] = await withError(async () => {
      return Payload.parse(await ctx.request.json())
    })

    if (payloadErr || !payload) {
      console.error(2, payloadErr)
      return getResponseError(payloadErr?.message || 'Wrong payload')
    }

    const [templateId, templateErr] = await withError(async () => {
      const id = generateId('template')
      // I haven't used s3 client with CopyObjectCommand because it's
      // browser base client, and requires browser based API which are not
      // available in unified node env(unenv)
      const projMiniature = await ctx.env.projectMiniatures.get(ctx.params.id.toString())

      console.log(projMiniature)

      if (!projMiniature) {
        throw Error('No project minaiutre found')
      }

      await ctx.env.publicAssets.put(`templates/${id}`, projMiniature.body)

      await ctx.env.db
        .prepare(
          `INSERT INTO templates (id, name, preview_shape, width, height, assets)
         VALUES (?, ?, ?, ?, ?, ?)`
        )
        .bind(id, payload.name, payload.previewShape, project.width, project.height, project.assets)
        .run()

      return id
    })

    if (templateErr || !templateId) {
      console.error(3, templateErr)
      return getResponseError('Failed to create a template')
    }

    return Response.json({ templateId }, { status: 201 })
  }
  // { adminOnly: true }
)
