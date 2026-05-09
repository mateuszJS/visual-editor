import { CreatorAPI, CreatorProps, ProjectSnapshot } from '@mateuszjs/magic-render/types'
import initCreator from '@mateuszjs/magic-render'

let onSelectAssetCallback: (assetId: [number, number, number, number]) => void
let onPreviewUpdateCallback: (canvas: HTMLCanvasElement) => void
let onExternalTextureCreationCallback: (url: string, setNewUrl: (url: string) => void) => void

let currentSnapshot: ProjectSnapshot = {
  width: 0,
  height: 0,
  assets: [] as Array<{ url: string }>, // for now we need only images mock for testing
}

/** this mock is created since currently github actions do not support GPU.
 * For WebGPU physical GPU is required, so far there is no way to simulate with CPU */
const initMagicRenderMock: typeof initCreator = function ({
  canvas,
  onAssetSelect,
  onPreviewUpdate,
  onSnapshotUpdate,
  onUpdateTool,
  onExternalTextureCreation,
}: CreatorProps): Promise<CreatorAPI> {
  if (canvas.getAttribute('data-magic-render-linked') === 'true') {
    // on purpose we do not compare lastCanvas to canvas to do not introduce any more logic to this mock
    throw new Error('WebGPU error when canvas was already linked with device')
  }

  canvas.setAttribute('data-magic-render-linked', 'true')
  onSelectAssetCallback = onAssetSelect
  onPreviewUpdateCallback = onPreviewUpdate
  onExternalTextureCreationCallback = onExternalTextureCreation

  return Promise.resolve({
    addImages: jest.fn((urls) => {
      currentSnapshot.assets = [...currentSnapshot.assets, ...urls.map((url) => ({ url }))]
      onSnapshotUpdate(currentSnapshot, true)
      return Promise.resolve()
    }),
    removeAsset: jest.fn(),
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    setSnapshot: jest.fn(async (snapshot, { produceSnapshot, addHistoryEntry }) => {
      if (produceSnapshot) {
        currentSnapshot = snapshot
        onSnapshotUpdate(currentSnapshot, produceSnapshot)
      }
    }),
    setTool: jest.fn((tool) => {
      onUpdateTool(tool)
    }),
    destroy: () => {
      canvas.removeAttribute('data-magic-render-linked')
    },
    updateAssetProps: jest.fn(),
    updateAssetEffects: jest.fn(),
    updateAssetBounds: jest.fn(),
    updateAssetTypoProps: jest.fn(),
    INFINITE_DISTANCE_THRESHOLD: 10000,
    INFINITE_DISTANCE: 100000,
    addText: jest.fn(),
    download: jest.fn(),
  })
}

export function __triggerSelectAsset(assetId: [number, number, number, number]) {
  onSelectAssetCallback(assetId)
}

export function __triggerPreviewUpdate(canvas: HTMLCanvasElement) {
  onPreviewUpdateCallback(canvas)
}

export function __triggerExternalTextureCreation(url: string, setNewUrl: (url: string) => void) {
  onExternalTextureCreationCallback(url, setNewUrl)
}

export default initMagicRenderMock
