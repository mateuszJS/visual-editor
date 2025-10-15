import errorStore from '@/stores/error'
import fetcher from '@/utils/fetcher'

export default function getOnTextureUpload(projectId: string) {
  return async (url: string, setNewUrl: (newUrl: string) => void) => {
    if (!url.startsWith('blob:')) return

    try {
      const file = await fetcher(url).then((res) => res.blob())
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetcher(`/api/project-uploads/${projectId}`, {
        method: 'POST',
        formData,
      })

      if (!response.ok) {
        errorStore.message = 'Failed to upload file.'
        return
      }

      const id = (await response.text()) as string
      setNewUrl(`/api/project-uploads/${projectId}/${id}`)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      errorStore.message = 'Failed to upload file.'
    }
  }
}
