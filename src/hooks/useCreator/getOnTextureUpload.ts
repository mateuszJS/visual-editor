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

      const response = await nativeFetcher<{ url: string; uploadId: string }>(
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

      // const uploadUrlJson = await uploadUrlRes.json()

      // const response = await fetch(uploadUrlJson.url, {
      //   // this is not our service API, so we don't use fetcher
      //   method: 'PUT',
      //   body: file,
      // })

      // if (!response.ok) {
      //   errorStore.message = 'Failed to upload file.'
      //   return
      // }

      const uploadId = response.headers.get('x-upload-id')

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
