import { useEffect } from 'react'
import useFetcher from '../useFetcher/useFetcher'
import { proxyMap } from 'valtio/utils'
import { useSnapshot } from 'valtio'
import { ApiStorageItem } from '../../../apiTypes'
import errorStore from '@/stores/error'
import nativeFetcher from '@/utils/nativeFetcher'

const storageStore = proxyMap<string, ApiStorageItem>()

export default function useStorage() {
  const { error, loading, fetcher } = useFetcher<ApiStorageItem[]>()
  const storedItems = useSnapshot(storageStore)

  useEffect(() => {
    fetcher('/api/storage', (items) => {
      items.forEach((item) => {
        storageStore.set(item.id, item)
      })
    })
  }, [])

  useEffect(() => {
    errorStore.message = error
  }, [error])

  const upload = async (blobUrl: string) => {
    const fileRes = await nativeFetcher(blobUrl)

    if (!fileRes.ok) {
      errorStore.message = 'Failed to fetch file.'
      return
    }

    const file = await fileRes.blob() // do we need this? Maybe we can just pass body

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const response = await nativeFetcher('/api/storage/', {
      method: 'PUT',
      body: file,
    })
  }

  return {
    loading: loading && storedItems.size === 0,
    error,
    items: storedItems,
    upload,
  }
}
