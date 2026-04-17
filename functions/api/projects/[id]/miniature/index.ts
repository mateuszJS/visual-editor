import { withSession } from '@/wrappers/session'
import { GetObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import withError from '@/utils/error'
import * as Project from '@/types/project'
import getS3Client from '@/clients/s3'
import getResponseError from '@/utils/getResponseError'
import getMiniatureUploadUrl from './getMiniatureUploadUrl'

const URL_LIFETIME_SECONDS = 60 * 60 * 24 * 7 // 7d, in seconds

async function assestOwner(ctx: EventContext<Env, 'id', never>, userId: string) {
  const project = await ctx.env.db
    .prepare(
      `SELECT id
        FROM projects
        WHERE id = ? AND owner_id = ?`
    )
    .bind(ctx.params.id, userId)
    .first<Pick<Project.DB, 'id'>>()

  if (!project) {
    throw Error(
      `user ${userId} tries to access miniature of project id: ${ctx.params.id} but is not the owner`
    )
  }
}

export const onRequestGet = withSession<'id'>(async (ctx, session) => {
  const [url, err] = await withError(async () => {
    await assestOwner(ctx, session.userId)

    return getSignedUrl(
      getS3Client(),
      new GetObjectCommand({
        Bucket: ctx.env.PROJECT_MINIATURES_BUCKET,
        Key: ctx.params.id.toString(),
      }),
      {
        expiresIn: URL_LIFETIME_SECONDS,
      }
    )
  })

  if (err) {
    return getResponseError('Failed to generate signed URL.', 403)
  }

  return new Response(null, {
    status: 307,
    headers: {
      Location: url,
      'Cache-Control': `max-age=${URL_LIFETIME_SECONDS}, private`,
    },
  })
})

export const onRequestPut = withSession<'id'>(async (ctx, session) => {
  const [url, err] = await withError(async () => {
    await assestOwner(ctx, session.userId)
    return await getMiniatureUploadUrl(ctx)
  })

  if (err) {
    return getResponseError('Failed to generate signed URL.', 403)
  }

  return Response.redirect(url, 307)
})
