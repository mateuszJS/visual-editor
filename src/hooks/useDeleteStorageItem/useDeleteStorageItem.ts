import errorStore from '@/stores/error'
import fetcher from '@/utils/fetcher'
import { storageStore } from '@/hooks/useStorage/useStorage'
import { captureError } from '@/utils/captureError'
import posthog from 'posthog-js'

export default function useDeleteStorageItem() {
  const deleteStorageItem = async (id: string) => {
    // use in the case of optimistic repsonse failure
    const safeCopy = storageStore.items.get(id)

    storageStore.items.delete(id)

    const onError = () => {
      errorStore.message = 'An error has occured while removing the asset. Please try again.'
      if (safeCopy) {
        storageStore.items.set(id, safeCopy)
      }
    }

    posthog.capture('storage_item_deleted')
    const response = await fetcher('/api/storage/' + id, { method: 'DELETE' })

    if ('err' in response) {
      captureError(Error(response.err))
      onError()
    }
  }

  return deleteStorageItem
}
