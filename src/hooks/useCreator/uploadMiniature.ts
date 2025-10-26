import nativeFetcher from '@/utils/nativeFetcher'

export default function uploadMiniature(canvas: HTMLCanvasElement, projectId: string) {
  canvas.toBlob((blob) => {
    try {
      const formData = new FormData()
      formData.append('file', blob!)

      nativeFetcher(`/api/projects/${projectId}/miniature`, {
        method: 'POST',
        formData,
      })
    } catch (err) {
      // console.error('Failed to upload miniature:', err) capture this log in the future
    }
  })
}
