import errorStore from '@/stores/error'
import nativeFetcher from '@/utils/nativeFetcher'
import getImageDataHash from './getImageDataHash'
import { MAX_FILE_SIZE } from 'apiConsts'

export default async function uploadTexture(url: string): Promise<string | null> {
  try {
    const fileRes = await nativeFetcher(url)

    if (!fileRes.ok) {
      throw Error("Couldn't obtain the local file")
    }

    const file = await fileRes.blob() // do we need this? Maybewe can just pass body

    if (file.size > MAX_FILE_SIZE) {
      errorStore.message = 'Max file size is 3 MB.'
      return null
    }

    const hash = await getImageDataHash(url)

    const response = await nativeFetcher('/api/storage', {
      method: 'PUT',
      body: file,
      options: {
        headers: {
          'x-hash': hash,
        },
      },
    })

    if (!response.ok) {
      throw Error('Response status code: ' + response.status)
    }

    const storageItemId = response.headers.get('x-storage-item-id')

    if (!storageItemId) {
      throw Error(`Header x-storage-item-id was not provided.`)
    }

    return '/api/storage/' + storageItemId
  } catch (err) {
    errorStore.message = 'Failed to upload file.'
  }

  return null
}
