import getStorageRedirect from './getStorageRedirect'
// import getUploadUrl from '../getUploadUrl'
// import { MAX_FILE_SIZE } from '@/api/consts'

export const onRequestGet = getStorageRedirect('storage_id')

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
