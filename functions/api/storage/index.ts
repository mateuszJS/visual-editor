import { withSession } from '@/wrappers/session'
import withError from '@/utils/error'
import getResponseError from '@/utils/getResponseError'
import getUploadUrl from './getUploadUrl'
import * as StorageItem from '@/types/storageItem'
import { MAX_FILE_SIZE } from '../consts'
import generateId from '@/utils/generateId'
import { MAP_TYPE_TO_PREFIX } from '../../../apiConsts'

export const onRequestPut = withSession(async (ctx, session) => {
  const contentLength = Number(ctx.request.headers.get('Content-Length'))

  // R2/S3 have no way to validate content type, so it's not enforced, so no reason to pass it
  if (Number.isNaN(contentLength) || contentLength <= 0 || contentLength > MAX_FILE_SIZE) {
    return getResponseError('Max file size is 3 MB')
  }

  const rowId = generateId('storageItem')
  const s3Id = rowId.slice(MAP_TYPE_TO_PREFIX.storageItem.length)

  const [url, err] = await withError(async () => {
    const storageItem = await ctx.env.db
      .prepare(
        `INSERT INTO storage (id, storage_id, type, owner_id, size)
          VALUES (?, ?, ?, ?, ?)
          RETURNING id`
      )
      .bind(rowId, s3Id, 'media', session.userId, contentLength)
      .first<Pick<StorageItem.DB, 'id'>>()

    if (!storageItem) {
      throw Error('Failed to insert storage item to D1')
    }

    return getUploadUrl(ctx, s3Id, contentLength)
  })

  if (err) {
    return getResponseError('Failed to generate signed URL.', 403)
  }

  return Response.redirect(url, 307)
})

// url to test upload:
// curl --request PUT "<URL>" --header "Content-Type: text/plain" --header "Content-Length: 10" --data "nagvsudXgvakgabdgdkfaxsuieg"

export const onRequestGet = withSession(async (ctx, session) => {
  const [storageItems, err] = await withError(async () => {
    // TODO: handle case when storage item is public
    const { results } = await ctx.env.db
      .prepare(
        `SELECT id, storage_id, type, owner_id, updated_at, public
        FROM storage
        WHERE owner_id = ?`
      )
      .bind(session.userId)
      .run<
        Pick<StorageItem.DB, 'id' | 'storage_id' | 'type' | 'owner_id' | 'updated_at' | 'public'>
      >()
    console.log('=========', results)

    return results.map((item) => StorageItem.toAPI(item))
  })

  if (err) {
    console.log('Failed to retrieve storage items', err)
    return getResponseError('Failed to retrieve storage items.', 503)
  }

  return Response.json(storageItems, { status: 200 })
})
