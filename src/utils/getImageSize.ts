export default function loadImageFromFile(image: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    try {
      const fileReader = new FileReader()

      fileReader.onload = () => {
        const img = new Image()

        img.onload = () => {
          resolve(img)
        }

        img.src = fileReader.result as string
      }

      fileReader.readAsDataURL(image)
    } catch (e) {
      reject(e)
    }
  })
}
