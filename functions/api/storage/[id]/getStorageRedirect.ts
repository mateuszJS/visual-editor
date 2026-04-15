import { withSession } from '@/wrappers/session'
import { GetObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import withError from '@/utils/error'
import * as StorageItem from '@/types/storageItem'
import getS3Client from '@/clients/s3'
import getResponseError from '@/utils/getResponseError'

const URL_LIFETIME_SECONDS = 60 * 60 * 24 * 7 // 7d, in seconds

async function getS3Id(
  ctx: EventContext<Env, 'id', never>,
  userId: string,
  redirectIdField: 'storage_id' | 'preview_id'
) {
  const sql =
    redirectIdField === 'storage_id'
      ? `SELECT storage_id
        FROM storage
        WHERE id = ? AND owner_id = ?`
      : `SELECT preview_id
        FROM storage
        WHERE id = ? AND owner_id = ?`

  const storageItem = await ctx.env.db
    .prepare(sql)
    .bind(ctx.params.id, userId)
    .first<Pick<StorageItem.DB, 'storage_id'>>()

  if (!storageItem) {
    throw Error(
      `user ${userId} tries to access storage item id: ${ctx.params.id} but is not the owner`
    )
  }

  return storageItem.storage_id
}

export default function getStorageRedirect(redirectIdField: 'storage_id' | 'preview_id') {
  return withSession<'id'>(async (ctx, session) => {
    const [url, err] = await withError(async () => {
      const storageItemId = await getS3Id(ctx, session.userId, redirectIdField)

      return getSignedUrl(
        getS3Client(),
        new GetObjectCommand({
          Bucket: ctx.env.USER_UPLOADS_BUCKET,
          Key: storageItemId,
        }),
        {
          expiresIn: URL_LIFETIME_SECONDS,
        }
      )
    })

    if (err) {
      console.error('Error generating signed URL:', err)
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
}
