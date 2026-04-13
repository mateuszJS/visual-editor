import errorStore from '@/stores/error'
import nativeFetcher from '@/utils/nativeFetcher'
import { MAP_TYPE_TO_PREFIX } from '../../../apiConsts'

export default async function onTextureUpload(url: string, setNewUrl: (newUrl: string) => void) {
  if (!url.startsWith('blob:')) return

  try {
    const fileRes = await nativeFetcher(url)

    if (!fileRes.ok) {
      errorStore.message = 'Failed to fetch file.'
      return
    }

    const file = await fileRes.blob() // do we need this? Maybewe can just pass body

    const response = await nativeFetcher('/api/storage', {
      method: 'PUT',
      body: file,
    })

    if (!response.ok) {
      errorStore.message = 'Failed to upload file.'
      return
    }

    const { pathname } = new URL(response.url)
    const storageItemId = pathname.slice(1) // We depend on the fact
    // that initial id as storage item in D1 has the same id as storage item in S3,
    // just with 'si_' prefix

    if (storageItemId) {
      setNewUrl(`/api/storage/${MAP_TYPE_TO_PREFIX.storageItem + storageItemId}`)
    } else {
      console.error('Storage Item ID is missing in the URL.')
    }
  } catch (err) {
    errorStore.message = 'Failed to upload file.'
  }
}
