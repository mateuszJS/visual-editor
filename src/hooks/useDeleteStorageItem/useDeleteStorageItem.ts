import errorStore from '@/stores/error'
import nativeFetcher from '@/utils/nativeFetcher'
import { storageStore } from '@/hooks/useStorage/useStorage'

export default function useDeleteStorageItem() {
  const deleteStorageItem = async (id: string) => {
    // use in the case of optimistic repsonse failure
    const safeCopy = storageStore.items.get(id)

    storageStore.items.delete(id)

    const onError = () => {
      errorStore.message = 'An erorr has occured while removing the asset. Please try again.'
      if (safeCopy) {
        storageStore.items.set(id, safeCopy)
      }
    }

    try {
      const response = await nativeFetcher('/api/storage/' + id, { method: 'DELETE' })
      if (!response.ok) {
        onError()
      }
    } catch (err) {
      onError()
    }
  }

  return deleteStorageItem
}
