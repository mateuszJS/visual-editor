import nativeFetcher from '@/utils/nativeFetcher'

export default function uploadMiniature(canvas: HTMLCanvasElement, projectId: string) {
  canvas.toBlob(async (blob) => {
    if (!blob) return

    try {
      await nativeFetcher(`/api/projects/${projectId}/miniature`, {
        method: 'PUT',
        body: blob,
        options: {
          headers: {
            'x-amz-meta-captured-at': new Date().toISOString(),
          },
        },
      })
    } catch (err) {
      // console.error('Failed to upload miniature:', err) capture this log in the future
    }
  })
}
