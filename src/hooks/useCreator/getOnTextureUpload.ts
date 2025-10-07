import errorStore from '@/stores/error'
import fetcher from '@/utils/fetcher'

export default (projectId: string) =>
  async function onTextureUpload(url: string, setNewUrl: (newUrl: string) => void) {
    console.log('Uploading texture from URL:', url)
    if (!url.startsWith('blob:')) return

    try {
      const file = await fetcher(url).then((res) => res.blob())
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetcher(`/api/project-uploads/${projectId}`, {
        method: 'POST',
        formData,
      })
      console.log('response', response.ok)
      if (!response.ok) {
        errorStore.message = 'Failed to upload file.'
        return
      }

      const id = (await response.text()) as string
      console.log('id', id)
      setNewUrl(`/api/project-uploads/${projectId}/${id}`)
    } catch (err) {
      console.error(err)
      errorStore.message = 'Failed to upload file.'
    }
  }
