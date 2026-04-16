import getS3Client from '@/clients/s3'
import { PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { MAX_FILE_SIZE } from 'apiConsts'

export default async function getMiniatureUploadUrl(
  ctx: EventContext<Env, 'id', never>
): Promise<string> {
  const generatedAt = ctx.request.headers.get('x-amz-meta-captured-at')
  const contentLength = Number(ctx.request.headers.get('content-length'))

  // R2/S3 have no way to validate content type, so it's not enforced, so no reason to pass it
  if (Number.isNaN(contentLength) || contentLength <= 0 || contentLength > MAX_FILE_SIZE) {
    throw Error('Invalid content length.')
  }

  if (!generatedAt) {
    throw Error('No x-amz-meta-captured-at header provided')
  }

  const projectId = ctx.params.id.toString()
  // ensure object is more recent than the one being currently used/uploaded
  const objMetadata = await ctx.env.projectMiniatures.head(projectId)

  const uploadedAt = objMetadata?.customMetadata?.['captured-at']

  if (uploadedAt && uploadedAt >= generatedAt) {
    throw Error('Provided version is outdated.')
  }

  const url = await getSignedUrl(
    getS3Client(),
    new PutObjectCommand({
      Bucket: ctx.env.PROJECT_MINIATURES_BUCKET,
      Key: projectId,
      ContentLength: contentLength,
      ContentType: 'image/png',
      Metadata: { 'captured-at': generatedAt },
    }),
    {
      expiresIn: 60 * 5, // 5 minutes
      unhoistableHeaders: new Set(['x-amz-meta-captured-at']),
    }
  )

  return url
}
