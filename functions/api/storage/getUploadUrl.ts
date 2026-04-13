import getS3Client from '@/clients/s3'
import { PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

export default async function getUploadUrl(
  ctx: EventContext<Env, never, never>,
  storageItemId: string,
  contentLength: number
): Promise<string> {
  const url = await getSignedUrl(
    getS3Client(),
    new PutObjectCommand({
      Bucket: ctx.env.USER_UPLOADS_BUCKET,
      Key: storageItemId,
      ContentLength: contentLength,
    }),
    {
      expiresIn: 60 * 5, // 5 minutes
      unhoistableHeaders: new Set(['x-amz-meta-updated-at']),
    }
  )

  return url
}
