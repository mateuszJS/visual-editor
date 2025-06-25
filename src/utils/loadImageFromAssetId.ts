import { getErrorMessage } from './fetcher/getErrorMessage'

export default function loadImageFromAssetId(assetId: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()

    img.onload = () => {
      resolve(img)
    }

    img.onerror = (err) => {
      console.error(err)
      reject(new Error(`Failed to load image from asset ID ${assetId}: ${getErrorMessage(err)}`))
    }

    img.src = `/api/project-assets/${assetId}`
  })
}
