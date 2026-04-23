import { captureError } from '@/utils/captureError'

export async function isWebGpuSupported() {
  if (!navigator.gpu) {
    captureError(new Error('Browser does not support WebGPU'), { webgpu: true })
    return false
  }

  const adapter = await navigator.gpu.requestAdapter()

  if (!adapter) {
    captureError(new Error('this browser supports webgpu but it appears disabled'), {
      webgpu: true,
    })
    return false
  }

  return true
}
