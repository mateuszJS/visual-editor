import errorStore from '@/stores/error'
import { getErrorMessage } from './fetcher/getErrorMessage'

async function loadImage(id: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()

    img.onload = () => {
      resolve(img)
    }

    img.onerror = (err) => {
      reject(new Error(`Failed to load image from asset ID ${id}: ${getErrorMessage(err)}`))
    }

    img.src = `/api/project-assets/${id}`
  })
}

export default async function loadImagesFromAssetIds(
  assetIds: string[]
): Promise<HTMLImageElement[]> {
  const results = await Promise.allSettled(assetIds.map(loadImage))
  const fulfilled = results.filter((result) => result.status === 'fulfilled')
  const rejected = results.filter((result) => result.status === 'rejected')

  if (rejected.length > 0) {
    errorStore.message = `Failed to load ${rejected.length} images`
  }

  return fulfilled.map((result) => result.value)
}
