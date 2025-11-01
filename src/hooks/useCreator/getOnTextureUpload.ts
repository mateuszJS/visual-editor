import errorStore from '@/stores/error'
import nativeFetcher from '@/utils/nativeFetcher'

export default function getOnTextureUpload(projectId: string) {
  return async (url: string, setNewUrl: (newUrl: string) => void) => {
    if (!url.startsWith('blob:')) return

    try {
      const fileRes = await nativeFetcher(url)

      if (!fileRes.ok) {
        errorStore.message = 'Failed to fetch file.'
        return
      }

      const file = await fileRes.blob() // do we need this? Maybewe can just pass body

      const response = await nativeFetcher(
        `/api/project-uploads/${projectId}?contentLength=${file.size}`,
        {
          method: 'PUT',
          body: file,
        }
      )

      if (!response.ok) {
        errorStore.message = 'Failed to upload file.'
        return
      }

      const { pathname } = new URL(response.url)
      const uploadId = pathname.split('/')[2]

      if (uploadId) {
        setNewUrl(`/api/project-uploads/${projectId}/${uploadId}`)
      } else {
        console.error('Upload ID is missing in the response headers.')
      }
    } catch (err) {
      errorStore.message = 'Failed to upload file.'
    }
  }
}
