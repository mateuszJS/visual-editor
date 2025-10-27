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

      const file = await fileRes.blob()

      const uploadUrlRes = await nativeFetcher(`/api/project-uploads/${projectId}/access-url`, {
        method: 'POST',
        json: { contentLength: file.size },
      })

      if (!uploadUrlRes.ok) {
        errorStore.message = 'Failed to upload file.'
        return
      }

      const uploadUrlJson = (await uploadUrlRes.json()) as { url: string; uploadId: string }

      // eslint-disable-next-line no-restricted-syntax
      const response = await fetch(uploadUrlJson.url, {
        // this is not our service API, so we don't use fetcher
        method: 'PUT',
        body: file,
      })

      if (!response.ok) {
        errorStore.message = 'Failed to upload file.'
        return
      }

      setNewUrl(`/api/project-uploads/${projectId}/${uploadUrlJson.uploadId}`)
    } catch (err) {
      errorStore.message = 'Failed to upload file.'
    }
  }
}
