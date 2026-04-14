import { withSession } from '@/wrappers/session'
import { GetObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import withError from '@/utils/error'
import * as StorageItem from '@/types/storageItem'
import getS3Client from '@/clients/s3'
import getResponseError from '@/utils/getResponseError'
// import getUploadUrl from '../getUploadUrl'
// import { MAX_FILE_SIZE } from '@/api/consts'

const URL_LIFETIME_SECONDS = 60 * 60 * 24 * 7 // 7d, in seconds

async function getS3Id(ctx: EventContext<Env, 'id', never>, userId: string) {
  const storageItem = await ctx.env.db
    .prepare(
      `SELECT storage_id
        FROM storage
        WHERE id = ? AND owner_id = ?`
    )
    .bind(ctx.params.id, userId)
    .first<Pick<StorageItem.DB, 'storage_id'>>()

  if (!storageItem) {
    throw Error(
      `user ${userId} tries to access storage item id: ${ctx.params.id} but is not the owner`
    )
  }

  return storageItem.storage_id
}

export const onRequestGet = withSession<'id'>(async (ctx, session) => {
  const [url, err] = await withError(async () => {
    const storageItemId = await getS3Id(ctx, session.userId)

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

// export const onRequestPut = withSession<'id'>(async (ctx, session) => {
//   const contentLength = Number(ctx.request.headers.get('Content-Length'))

//   // R2/S3 have no way to validate content type, so it's not enforced, so no reason to pass it
//   if (Number.isNaN(contentLength) || contentLength <= 0 || contentLength > MAX_FILE_SIZE) {
//     return getResponseError('Max file size is 3 MB')
//   }

//   const [url, err] = await withError(async () => {
//     const storageItemId = await getStorageItemId(ctx, session.userId)
//     return getUploadUrl(ctx, storageItemId, contentLength)
//   })

//   const [, dbErr] = await withError(async () => {
//     await ctx.env.db
//       .prepare(
//         `INSERT INTO storage (storage_id, type, owner_id, size)
//             VALUES (?, ?, ?, ?)`
//       )
//       .bind(ctx.params.id, 'media', session.userId, contentLength)
//       .run()
//   })

//   if (dbErr || err) {
//     return getResponseError('Failed to generate signed URL.', 403)
//   }

//   return Response.redirect(url, 307)
// })
