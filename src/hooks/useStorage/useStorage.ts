import { useEffect } from 'react'
import useFetcher from '../useFetcher/useFetcher'
import { proxyMap } from 'valtio/utils'
import { proxy, useSnapshot } from 'valtio'
import { ApiStorageItem } from '../../../apiTypes'
import errorStore from '@/stores/error'
// import nativeFetcher from '@/utils/nativeFetcher'

const PROJECTS_LIST_TTL = 1000 * 60 * 60 * 1 // 1 hour

export const storageStore = proxy({
  initializedAt: 0,
  isRequesting: false,
  items: proxyMap<string, ApiStorageItem>(),
})

export function invalidateStorage() {
  storageStore.initializedAt = 0
}

export default function useStorage() {
  const { error, fetcher } = useFetcher<ApiStorageItem[]>()
  const storage = useSnapshot(storageStore)

  useEffect(() => {
    const isOutdated = Date.now() - storage.initializedAt > PROJECTS_LIST_TTL

    if (isOutdated && !storage.isRequesting) {
      storageStore.isRequesting = true

      fetcher(`/api/storage`, (items) => {
        items.forEach((item) => {
          storageStore.items.set(item.id, item)
        })

        storageStore.initializedAt = Date.now()
        storageStore.isRequesting = false
      })
    }
  }, [])

  useEffect(() => {
    errorStore.message = error
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
    loading: !error && storage.initializedAt === 0,
    error,
    items: storage.items,
    upload,
  }
}
