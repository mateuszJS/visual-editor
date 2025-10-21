import errorStore from '@/stores/error'
import fetcher from '@/utils/fetcher'

export default function getOnTextureUpload(projectId: string) {
  return async (url: string, setNewUrl: (newUrl: string) => void) => {
    if (!url.startsWith('blob:')) return

    try {
      const file = await fetcher(url).then((res) => res.blob())
      const uploadUrlRes = await fetcher(`/api/project-uploads/${projectId}/access-url`, {
        method: 'POST',
        json: { contentLength: file.size },
      })

      const uploadUrlJson = await uploadUrlRes.json()

      if (!uploadUrlJson.url || !uploadUrlJson.uploadId) {
        throw Error(
          `Failed to generate upload url. url: ${uploadUrlJson.url}, uploadId: ${uploadUrlJson.uploadId}`
        )
      }

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
