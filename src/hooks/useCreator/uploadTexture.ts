import errorStore from '@/stores/error'
import getImageDataHash from './getImageDataHash'
import { MAX_FILE_SIZE } from 'apiConsts'
import { captureError } from '@/utils/captureError'
import fetcher from '@/utils/fetcher'
import posthog from 'posthog-js'

const defaultErrorMsg = 'File upload has failed. Please try again or choose a different file.'

export default async function uploadTexture(url: string): Promise<string | null> {
  let file: Blob

  try {
    // eslint-disable-next-line no-restricted-syntax
    const fileRes = await fetch(url)

    if (!fileRes.ok) {
      errorStore.message = defaultErrorMsg
      captureError(
        Error(
          `Failed to obtain fetch local file. Status: ${fileRes.status}, statusText: ${fileRes.statusText}`
        )
      )
      return null
    }

    file = await fileRes.blob()
  } catch (err) {
    errorStore.message = defaultErrorMsg
    captureError(err)
    return null
  }

  if (file.size > MAX_FILE_SIZE) {
    errorStore.message = 'File cannot be larger than 3 MB.'
    posthog.capture('Too large upload', { size: file.size })
    return null
  }

  const hash = await getImageDataHash(url)

  const response = await fetcher('/api/storage', {
    method: 'PUT',
    body: file,
    options: {
      headers: {
        'x-hash': hash,
      },
    },
  })

  if ('err' in response) {
    errorStore.message = defaultErrorMsg
    captureError(
      Error(
        `Failed to obtain fetch local file. Status: ${response.status}, statusText: ${response.err}`
      )
    )
    return null
  }

  const storageItemId = response.headers.get('x-storage-item-id')

  if (!storageItemId) {
    errorStore.message = defaultErrorMsg
    captureError(Error('Header x-storage-item-id was not provided.'))
    return null
  }

  return '/api/storage/' + storageItemId
}
