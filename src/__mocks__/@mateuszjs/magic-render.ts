import type { SerializedOutputAsset, CreatorAPI } from '@mateuszjs/magic-render'

let onSelectAssetCallback: (assetId: number | null) => void
let onUpdateAssetsCallback: (assets: SerializedOutputAsset[]) => void

/** this mock is created since currently github actions do not support GPU.
 * For WebGPU physical GPU is required, so far there is no way to simulate with CPU */
export default function initMagicRenderMock(
  canvas: HTMLCanvasElement,
  onUpdateTextures: (url: string, setNewUrl: (newUrl: string) => void) => void,
  onUpdateAssets: (assets: SerializedOutputAsset[]) => void,
  onSelectAsset: (assetId: number | null) => void
): Promise<CreatorAPI> {
  if (canvas.getAttribute('data-magic-render-linked') === 'true') {
    // on purpose we do not compare lastCanvas to canvas to do not introduce any more logic to this mock
    throw new Error('WebGPU error when canvas was already linked with device')
  }

  canvas.setAttribute('data-magic-render-linked', 'true')
  onSelectAssetCallback = onSelectAsset
  onUpdateAssetsCallback = onUpdateAssets

  return Promise.resolve({
    addImage: jest.fn(),
    removeAsset: jest.fn(),
    resetAssets: jest.fn(),
    setTool: jest.fn(),
    destroy: () => {
      canvas.removeAttribute('data-magic-render-linked')
    },
  })
}

export function __triggerSelectAsset(assetId: number | null) {
  onSelectAssetCallback(assetId)
}

export function __triggerUpdateAssets(assets: SerializedOutputAsset[]) {
  onUpdateAssetsCallback(assets)
}

// importing values from valtio works correctly, so it's on our side
// we can play with esm exports from magic-render to fix it
export enum CreatorTool {
  None = 0,
  DrawShape = 1,
}
