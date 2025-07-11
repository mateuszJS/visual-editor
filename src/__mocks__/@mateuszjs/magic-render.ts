import type { SerializedAsset } from '@mateuszjs/magic-render'

let onSelectAssetCallback: (assetId: number | null) => void

/** this mock is created since currently github actions do not support GPU.
 * For WebGPU physical GPU is required, so far there is no way to simulate with CPU */
export default function initMagicRenderMock(
  canvas: HTMLCanvasElement,
  initialAssets: SerializedAsset[],
  onUpdateAssets: (assets: SerializedAsset[]) => void,
  onSelectAsset: (assetId: number | null) => void
) {
  if (canvas.getAttribute('data-magic-render-linked') === 'true') {
    // on purpose we do not compare lastCanvas to canvas to do not introduce any more logic to this mock
    throw new Error('WebGPU error when canvas was already linked with device')
  }

  canvas.setAttribute('data-magic-render-linked', 'true')
  onSelectAssetCallback = onSelectAsset

  return Promise.resolve({
    /** We need to figure otu the wya how ot notify outside world about changes in creator canvas
     * it will be also useful in the test
     */
    addImage: jest.fn(),
    removeAsset: jest.fn(),
    destroy: () => {
      canvas.removeAttribute('data-magic-render-linked')
    },
  })
}

export function __triggerSelectAsset(assetId: number | null) {
  onSelectAssetCallback(assetId)
}
