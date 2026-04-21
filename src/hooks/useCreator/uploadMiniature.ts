import { captureError } from '@/utils/captureError'
import nativeFetcher from '@/utils/nativeFetcher'
import throttle from '@/utils/throttle'

const sendBlob = async (blob: Blob, projectId: string, capturedAt: string) => {
  try {
    await nativeFetcher(`/api/projects/${projectId}/miniature`, {
      method: 'PUT',
      body: blob,
      options: {
        headers: {
          'x-amz-meta-captured-at': capturedAt,
        },
      },
    })
  } catch (err) {
    captureError(err)
  }
}

let previewToUpdate = null as { projectId: string; blob: Blob; capturedAt: string } | null
export const alternativeMiniatureUpdate = () => {
  if (previewToUpdate) {
    sendBlob(previewToUpdate.blob, previewToUpdate.projectId, previewToUpdate.capturedAt)
    previewToUpdate = null
  }
}

const throttleMiniatureUpdate = throttle(alternativeMiniatureUpdate, 1000 * 60)

export function uploadMinaiture(canvas: HTMLCanvasElement, projectId: string) {
  canvas.toBlob(async (blob) => {
    if (!blob) return

    const capturedAt = new Date().toISOString()

    if (navigator.serviceWorker.controller) {
      sendBlob(blob, projectId, capturedAt)
      previewToUpdate = null
    } else {
      previewToUpdate = {
        projectId,
        blob,
        capturedAt,
      }
      throttleMiniatureUpdate()
    }
  })
}
