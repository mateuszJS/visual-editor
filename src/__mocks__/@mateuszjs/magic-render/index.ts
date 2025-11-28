import { CreatorAPI, CreatorTool, ProjectSnapshot } from '@mateuszjs/magic-render/types'
import initCreator from '@mateuszjs/magic-render'

let onSelectAssetCallback: (assetId: [number, number, number, number]) => void
let onPreviewUpdateCallback: (canvas: HTMLCanvasElement) => void

/** this mock is created since currently github actions do not support GPU.
 * For WebGPU physical GPU is required, so far there is no way to simulate with CPU */
const initMagicRenderMock: typeof initCreator = function (
  width: number,
  height: number,
  canvas: HTMLCanvasElement,
  uploadTexture: (url: string, onNewUrl: (newUrl: string) => void) => void,
  onSnapshotUpdate: (snapshot: ProjectSnapshot, commit: boolean) => void,
  onAssetSelect: (assetId: [number, number, number, number]) => void,
  onProcessingUpdate: (inProgress: boolean) => void,
  onPreviewUpdate: (canvas: HTMLCanvasElement) => void,
  onUpdateTool: (tool: CreatorTool) => void
): Promise<CreatorAPI> {
  if (canvas.getAttribute('data-magic-render-linked') === 'true') {
    // on purpose we do not compare lastCanvas to canvas to do not introduce any more logic to this mock
    throw new Error('WebGPU error when canvas was already linked with device')
  }

  canvas.setAttribute('data-magic-render-linked', 'true')
  onSelectAssetCallback = onAssetSelect
  onPreviewUpdateCallback = onPreviewUpdate

  return Promise.resolve({
    addImages: jest.fn(),
    removeAsset: jest.fn(),
    setSnapshot: jest.fn(async (snapshot, withSnapshot) => {
      if (withSnapshot) {
        onSnapshotUpdate(snapshot, withSnapshot)
      }
    }),
    setTool: jest.fn((tool) => {
      onUpdateTool(tool)
    }),
    destroy: () => {
      canvas.removeAttribute('data-magic-render-linked')
    },
    updateAssetProps: jest.fn(),
    updateAssetBounds: jest.fn(),
    updateAssetTypoProps: jest.fn(),
    INFINITE_DISTANCE_THRESHOLD: 10000,
    INFINITE_DISTANCE: 100000,
  })
}

export function __triggerSelectAsset(assetId: [number, number, number, number]) {
  onSelectAssetCallback(assetId)
}

export function __triggerPreviewUpdate(canvas: HTMLCanvasElement) {
  onPreviewUpdateCallback(canvas)
}

export default initMagicRenderMock
