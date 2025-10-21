import { withSession } from '../../../wrappers/session'
import { PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import withError from '../../../utils/error'
import * as Project from '../../../types/project'
import { v4 as uuid } from 'uuid'
import getS3Client from '../../../clients/s3'
import getResponseError from '../../../utils/getResponseError'

const MAX_FILE_SIZE = 3 * 1024 * 1024 // 3MB

export const onRequestPost = withSession<'projectId'>(async (ctx, session) => {
  // R2/S3 have no way to validate content type, so it's not enforced, so no reason to pass it
  const { contentLength } = await ctx.request.json<{
    contentLength: number
  }>()

  if (typeof contentLength !== 'number' || contentLength <= 0 || contentLength > MAX_FILE_SIZE) {
    return getResponseError('Invalid content length.')
  }

  const uploadId = uuid()

  const [url, err] = await withError(() => {
    const project = ctx.env.db
      .prepare(
        `SELECT id
        FROM projects
        WHERE id = ? AND owner_id = ?`
      )
      .bind(ctx.params.projectId, session.userId)
      .first<Pick<Project.DB, 'id'>>()

    if (!project) {
      throw Error(
        `user ${session.userId} tries to upload assets to project ${ctx.params.projectId} but is not the project owner`
      )
    }

    return getSignedUrl(
      getS3Client(),
      new PutObjectCommand({
        Bucket: 'user-uploads',
        Key: `${ctx.params.projectId}/${uploadId}`,
        ContentLength: contentLength,
      }),
      {
        expiresIn: 60 * 10, // 10 minutes
      }
    )
  })

  if (err) {
    return new Response('Failed to generate signed URL.', { status: 401 })
  }

  return Response.json({ url, uploadId }, { status: 200 })
})

// url to test upload:
// curl --request PUT "<URL>" --header "Content-Type: text/plain" --header "Content-Length: 10" --data "nagvsudXgvakgabdgdkfaxsuieg"
