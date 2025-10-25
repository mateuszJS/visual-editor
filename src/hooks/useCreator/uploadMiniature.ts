import fetcher from '@/utils/fetcher'

export default function uploadMiniature(canvas: HTMLCanvasElement, projectId: string) {
  canvas.toBlob((blob) => {
    try {
      const formData = new FormData()
      formData.append('file', blob!)

      fetcher(`/api/projects/${projectId}/miniature`, {
        method: 'POST',
        formData,
      })
    } catch (err) {
      // console.error('Failed to upload miniature:', err) capture this log in the future
    }
  })
}
