import getS3Client from '@/clients/s3'
import { PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import * as Project from '@/types/project'
import { MAX_FILE_SIZE } from '@/api/consts'

export default async function getUploadUrl(
  ctx: EventContext<Env, never, never>,
  projectId: string,
  uploadId: string,
  contentLength: number,
  userId: string
): Promise<string> {
  // R2/S3 have no way to validate content type, so it's not enforced, so no reason to pass it
  if (Number.isNaN(contentLength) || contentLength <= 0 || contentLength > MAX_FILE_SIZE) {
    throw Error('Invalid content length.')
  }

  const project = await ctx.env.db
    .prepare(
      `SELECT id
        FROM projects
        WHERE id = ? AND owner_id = ?`
    )
    .bind(projectId, userId)
    .first<Pick<Project.DB, 'id'>>()

  if (!project) {
    throw Error(
      `user ${userId} tries to upload assets to project ${projectId} but is not the project owner`
    )
  }

  const url = await getSignedUrl(
    getS3Client(),
    new PutObjectCommand({
      Bucket: ctx.env.USER_UPLOADS_BUCKET,
      Key: `${projectId}/${uploadId}`,
      ContentLength: contentLength,
    }),
    {
      expiresIn: 60 * 5, // 5 minutes
    }
  )

  return url
}
