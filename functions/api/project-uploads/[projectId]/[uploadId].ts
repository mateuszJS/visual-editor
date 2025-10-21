import { withSession } from '../../../wrappers/session'
import { GetObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import withError from '../../../utils/error'
import * as Project from '../../../types/project'
import getS3Client from '../../../clients/s3'

const urlLifetimeSeconds = 60 * 60 * 24 * 7 // 7d, in seconds

export const onRequestGet = withSession<'projectId' | 'uploadId'>(async (ctx, session) => {
  const [url, err] = await withError(async () => {
    const project = await ctx.env.db
      .prepare(
        `SELECT id
        FROM projects
        WHERE id = ? AND owner_id = ?`
      )
      .bind(ctx.params.projectId, session.userId)
      .first<Pick<Project.DB, 'id'>>()

    if (!project) {
      throw Error(
        `user ${session.userId} tries to access asset from project ${ctx.params.projectId} but is not the project owner`
      )
    }

    return getSignedUrl(
      getS3Client(),
      new GetObjectCommand({
        Bucket: 'user-uploads',
        Key: `${ctx.params.projectId}/${ctx.params.uploadId}`,
      }),
      {
        expiresIn: urlLifetimeSeconds,
      }
    )
  })

  if (err) {
    return new Response('Failed to generate signed URL.', { status: 401 })
  }

  return new Response(null, {
    status: 307,
    headers: {
      Location: url,
      'Cache-Control': `max-age=${urlLifetimeSeconds}, private`,
    },
  })
})
