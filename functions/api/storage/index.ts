import { withSession } from '@/wrappers/session'
import withError from '@/utils/error'
import getResponseError from '@/utils/getResponseError'
import * as StorageItem from '@/types/storageItem'
import { MAX_FILE_SIZE } from 'apiConsts'
import generateId from '@/utils/generateId'

const allowedContentType = ['image/png', 'image/jpeg']

export const onRequestPut = withSession(async (ctx, session) => {
  const hash = ctx.request.headers.get('x-hash')
  const contentLength = Number(ctx.request.headers.get('content-length'))
  const contentType = ctx.request.headers.get('content-type')

  if (!hash) {
    // TODO: replace it with user friendly message, and the reason should be send to analytics
    return getResponseError('Hash provided via x-hash is required')
  }

  // contentLength is alreayd compressed, so is smaller than actual size
  // later we check actual size
  if (Number.isNaN(contentLength) || contentLength <= 0 || contentLength > MAX_FILE_SIZE) {
    return getResponseError('Max file size is 3 MB.')
  }
  if (!contentType || !allowedContentType.includes(contentType)) {
    return getResponseError('Invalid content type.')
  }

  const s3Id = generateId('s3')

  const [s3Object, s3Error] = await withError(async () => {
    const s3Obj = await ctx.env.userUploads.put(s3Id, ctx.request.body, {
      httpMetadata: {
        contentType,
      },
    })

    if (s3Obj === null) {
      throw Error('Precondition failed or upload returned null')
    }

    if (s3Obj.size > MAX_FILE_SIZE) {
      await ctx.env.userUploads.delete(s3Obj.key)
      throw Error('File is bigger than 3 MB.')
    }

    return s3Obj
  })

  if (s3Error) {
    return getResponseError('Upload has failed.', 500)
  }

  // return Response.json({
  //   key: object.key,
  //   size: object.size,
  //   etag: object.etag,
  // });

  const storageItemId = generateId('storageItem')

  const [, err] = await withError(async () => {
    const storageItem = await ctx.env.db
      .prepare(
        `INSERT INTO storage (id, storage_id, preview_id, type, owner_id, size, hash)
          VALUES (?, ?, ?, ?, ?, ?, ?)
          RETURNING id`
      )
      .bind(storageItemId, s3Id, s3Id, 'media', session.userId, s3Object.size, hash)
      .first<Pick<StorageItem.DB, 'id'>>()

    if (!storageItem) {
      throw Error('Failed to insert storage item to D1')
    }
  })

  if (err) {
    await ctx.env.userUploads.delete(s3Object.key)
    return getResponseError('Upload has failed.', 500)
  }

  return new Response(null, {
    status: 200,
    headers: {
      etag: s3Object.etag,
      'x-storage-item-id': storageItemId,
    },
  }) // jsut because s3 also return 200, isntead of 204
  // I assue it might affect ETag behaviour
})

// url to test upload:
// curl --request PUT "<URL>" --header "Content-Type: text/plain" --header "Content-Length: 10" --data "nagvsudXgvakgabdgdkfaxsuieg"

export const onRequestGet = withSession(async (ctx, session) => {
  const [storageItems, err] = await withError(async () => {
    // TODO: handle case when storage item is public
    const { results } = await ctx.env.db
      .prepare(
        `SELECT id, size, hash, type, updated_at, public, name
        FROM storage
        WHERE owner_id = ?`
      )
      .bind(session.userId)
      .run<
        Pick<StorageItem.DB, 'id' | 'size' | 'hash' | 'type' | 'updated_at' | 'public' | 'name'>
      >()

    return results.map((item) => StorageItem.toAPI(item))
  })

  if (err) {
    return getResponseError('Failed to retrieve storage items.', 503)
  }

  return Response.json(storageItems, { status: 200 })
})
