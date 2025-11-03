import { withSession } from '@/wrappers/session'
import { GetObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import withError from '@/utils/error'
import * as Project from '@/types/project'
import getS3Client from '@/clients/s3'
import getResponseError from '@/utils/getResponseError'
import getUploadUrl from '../getUploadUrl'

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
        Bucket: ctx.env.USER_UPLOADS_BUCKET,
        Key: `${ctx.params.projectId}/${ctx.params.uploadId}`,
      }),
      {
        expiresIn: urlLifetimeSeconds,
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
      'Cache-Control': `max-age=${urlLifetimeSeconds}, private`,
    },
  })
})

export const onRequestPut = withSession<'projectId' | 'uploadId'>(async (ctx, session) => {
  const generatedAt = ctx.request.headers.get('x-amz-meta-updated-at')
  const contentLength = Number(ctx.request.headers.get('Content-Length'))

  const [url, err] = await withError(async () =>
    getUploadUrl(
      ctx,
      ctx.params.projectId as string,
      ctx.params.uploadId as string,
      contentLength,
      session.userId,
      generatedAt
    )
  )

  if (err) {
    console.error(err)
    return getResponseError('Failed to generate signed URL.', 403)
  }

  return Response.redirect(url, 307)
})

// url to test upload:
// curl --request PUT "<URL>" --header "Content-Type: text/plain" --header "Content-Length: 10" --data "nagvsudXgvakgabdgdkfaxsuieg"
