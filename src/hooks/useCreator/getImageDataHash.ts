/**
 * A simple, non-cryptographic hash function (djb2) for raw pixel data.
 * @param bitmap The ImageBitmap to hash.
 * @returns A hash string.
 */
export default async function getImageDataHash(url: string) {
  const img = await getImage(url)
  const bitmap = await createImageBitmap(img)

  const { ctx } = getImageData(bitmap, bitmap.width, bitmap.height)
  const data = ctx.getImageData(0, 0, bitmap.width, bitmap.height).data

  let hash = 5381
  for (let i = 0; i < data.length; i++) {
    // Bitwise operations are fast
    hash = ((hash << 5) + hash + data[i]) >>> 0 /* hash * 33 + c, masked to uint32 */
  }

  bitmap.close()

  return String(hash)
}

function getImage(url: string): Promise<HTMLImageElement> {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.src = url
    img.onload = () => resolve(img)
    img.onerror = (err) => reject(err)
  })
}

function getImageData(img: CanvasImageSource, width: number, height: number) {
  const canvas = new OffscreenCanvas(width, height)
  const ctx = canvas.getContext('2d')!
  ctx.drawImage(img, 0, 0, width, height)
  return { canvas, ctx }
}
