import errorStore from '@/stores/error'
import fetcher from '@/utils/fetcher'

export default async function onTextureUpload(url: string, setNewUrl: (newUrl: string) => void) {
  if (!url.startsWith('blob:')) return

  try {
    const file = await fetcher(url).then((res) => res.blob())
    const formData = new FormData()
    formData.append('file', file)

    const response = await fetcher('/api/project-textures', {
      method: 'POST',
      formData,
    })

    if (!response.ok) {
      errorStore.message = 'Failed to upload file.'
      return
    }

    const id = (await response.text()) as string
    setNewUrl(`/api/project-textures/${id}`)
  } catch (err) {
    console.error(err)
    errorStore.message = 'Failed to upload file.'
  }
}
