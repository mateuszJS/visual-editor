export default async function getSizeFromImages(
  defaultWidth: number,
  defaultHeight: number,
  urls: string[]
) {
  const promises = urls.map(
    (url) =>
      new Promise<HTMLImageElement>((resolve, reject) => {
        const img = new Image()
        img.onload = () => resolve(img)
        img.onerror = () => reject()
        img.src = url
      })
  )
  const results = await Promise.allSettled(promises)
  const size = results.reduce(
    (acc, result) => {
      if (result.status === 'fulfilled') {
        return {
          width: Math.max(acc.width, result.value.width),
          height: Math.max(acc.height, result.value.height),
        }
      }
      return acc
    },
    { width: 0, height: 0 }
  )

  // just in case all images failed to load
  if (size.width === 0 || size.height === 0) {
    size.width = defaultWidth
    size.height = defaultHeight
  }

  return size
}
