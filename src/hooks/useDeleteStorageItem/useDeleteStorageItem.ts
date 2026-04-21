import errorStore from '@/stores/error'
import nativeFetcher from '@/utils/nativeFetcher'
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

    try {
      posthog.capture('storage_item_deleted')
      const response = await nativeFetcher('/api/storage/' + id, { method: 'DELETE' })
      if (!response.ok) {
        onError()
      }
    } catch (err) {
      captureError(err)
      onError()
    }
  }

  return deleteStorageItem
}
