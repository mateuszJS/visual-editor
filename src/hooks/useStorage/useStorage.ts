import { useEffect } from 'react'
import { proxyMap } from 'valtio/utils'
import { proxy, useSnapshot } from 'valtio'
import { ApiStorageItem } from '../../../apiTypes'
import errorStore from '@/stores/error'
import fetcher from '@/utils/fetcher'
import { captureError } from '@/utils/captureError'

export const storageStore = proxy({
  outdated: false,
  loading: false,
  error: null as null | string,
  items: proxyMap<string, ApiStorageItem>(),
})

export function invalidateStorageItems() {
  storageStore.outdated = true
}

export async function initializeStorage() {
  if (storageStore.loading) return

  storageStore.loading = true
  storageStore.error = null

  const response = await fetcher<ApiStorageItem[]>('/api/storage')
  storageStore.outdated = false
  storageStore.loading = false

  if ('err' in response) {
    storageStore.error = "We couldn't fetch items from your storage."
    captureError(Error(response.err))
    return
  }

  response.json.toSorted(sortStorageItemByUpdatedAt).forEach((item) => {
    storageStore.items.set(item.id, item)
  })
  storageStore.error = null
}

export default function useStorage() {
  const { error, loading, items, outdated } = useSnapshot(storageStore)

  useEffect(() => {
    if (outdated) {
      initializeStorage()
    }

    if (error) {
      errorStore.message = error
      storageStore.error = null
    }

    const intervalId = setInterval(
      () => {
        storageStore.outdated = true
      },
      1000 * 60 * 60 * 1 /* 12 hour */
    )

    return () => {
      clearInterval(intervalId)
    }
  }, [error])

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const upload = async (blobUrl: string) => {
    // const fileRes = await nativeFetcher(blobUrl)
    // if (!fileRes.ok) {
    //   errorStore.message = 'Failed to fetch file.'
    //   return
    // }
    // const file = await fileRes.blob() // do we need this? Maybe we can just pass body
    // // eslint-disable-next-line @typescript-eslint/no-unused-vars
    // const response = await nativeFetcher('/api/storage/', {
    //   method: 'PUT',
    //   body: file,
    // })
  }

  return {
    loading,
    error,
    items,
    upload,
  }
}

function sortStorageItemByUpdatedAt(a: ApiStorageItem, b: ApiStorageItem) {
  if (a.updatedAt < b.updatedAt) return 1
  if (a.updatedAt > b.updatedAt) return -1
  return 0
}
