import nativeFetcher from '@/utils/nativeFetcher'

export default function uploadMiniature(canvas: HTMLCanvasElement, projectId: string) {
  canvas.toBlob(async (blob) => {
    if (!blob) return

    try {
      const response = await nativeFetcher<{ url: string; uploadId: string }>(
        `/api/project-uploads/${projectId}/miniature?contentLength=${blob.size}`,
        {
          method: 'PUT',
          body: blob,
        }
      )

      if (!response.ok) {
        return
      }

      // const uploadUrlJson = await uploadUrlRes.json()

      // // eslint-disable-next-line no-restricted-syntax
      // await fetch(uploadUrlJson.url, {
      //   // this is not our service API, so we don't use fetcher
      //   method: 'PUT',
      //   body: blob,
      // })
    } catch (err) {
      // console.error('Failed to upload miniature:', err) capture this log in the future
    }
  })
}
