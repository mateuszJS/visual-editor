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
  userId: string,
  generatedAt: string | null // useful only while updating miniatures from possibly outdated local service worker cache
  // if no generatedAt, always allow
): Promise<string> {
  // R2/S3 have no way to validate content type, so it's not enforced, so no reason to pass it
  if (Number.isNaN(contentLength) || contentLength <= 0 || contentLength > MAX_FILE_SIZE) {
    throw Error('Invalid content length.')
  }

  const objKey = `${projectId}/${uploadId}`
  console.log('ObjKey:', objKey)
  console.log('GeneratedAt:', generatedAt)
  if (generatedAt) {
    // ensure object is more recent than the one being currently used/uploaded
    const objMetadata = await ctx.env.userUploads.head(objKey)
    const uploadedAt = objMetadata?.customMetadata?.uploadedAt
    console.log('customMetadata:', objMetadata)
    console.log('uploadedAt:', uploadedAt)

    if (uploadedAt && uploadedAt >= generatedAt) {
      throw Error('Provided version is outdated.')
    }
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
    throw Error(`User ${userId} cannot upload this asset to project ${projectId}.`)
  }

  const metaData = generatedAt ? { 'Updated-at': generatedAt } : undefined

  const url = await getSignedUrl(
    getS3Client(),
    new PutObjectCommand({
      Bucket: ctx.env.USER_UPLOADS_BUCKET,
      Key: objKey,
      ContentLength: contentLength,
      Metadata: metaData,
    }),
    {
      expiresIn: 60 * 5, // 5 minutes
      unhoistableHeaders: new Set(['x-amz-meta-updated-at']),
    }
  )

  return url
}
