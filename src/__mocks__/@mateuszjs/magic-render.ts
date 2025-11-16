import type { CreatorAPI, ProjectSnapshot } from '@mateuszjs/magic-render'

let onSelectAssetCallback: (assetId: [number, number, number, number]) => void
let onPreviewUpdateCallback: (canvas: HTMLCanvasElement) => void

/** this mock is created since currently github actions do not support GPU.
 * For WebGPU physical GPU is required, so far there is no way to simulate with CPU */
export default function initMagicRenderMock(
  width: number,
  height: number,
  canvas: HTMLCanvasElement,
  uploadTexture: (url: string, onNewUrl: (newUrl: string) => void) => void,
  onSnapshotUpdate: (snapshot: ProjectSnapshot) => void,
  onAssetSelect: (assetId: [number, number, number, number]) => void,
  onProcessingUpdate: (inProgress: boolean) => void,
  onPreviewUpdate: (canvas: HTMLCanvasElement) => void,
  onUpdateTool: (tool: CreatorTool) => void,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onUpdateProps: (bounds: unknown[] | null, props: Partial<unknown> | null) => void
): Promise<CreatorAPI> {
  if (canvas.getAttribute('data-magic-render-linked') === 'true') {
    // on purpose we do not compare lastCanvas to canvas to do not introduce any more logic to this mock
    throw new Error('WebGPU error when canvas was already linked with device')
  }

  canvas.setAttribute('data-magic-render-linked', 'true')
  onSelectAssetCallback = onAssetSelect
  onPreviewUpdateCallback = onPreviewUpdate

  return Promise.resolve({
    addImage: jest.fn(),
    removeAsset: jest.fn(),
    setSnapshot: jest.fn((snapshot, withSnapshot) => {
      if (withSnapshot) {
        onSnapshotUpdate(snapshot)
      }
    }),
    setTool: jest.fn((tool) => {
      onUpdateTool(tool)
    }),
    destroy: () => {
      canvas.removeAttribute('data-magic-render-linked')
    },
    toggleSharedTextEffects: jest.fn(),
    updateAssetProps: jest.fn(),
    updateAssetBounds: jest.fn(),
  })
}

export function __triggerSelectAsset(assetId: [number, number, number, number]) {
  onSelectAssetCallback(assetId)
}

export function __triggerPreviewUpdate(canvas: HTMLCanvasElement) {
  onPreviewUpdateCallback(canvas)
}

// we could import actual exports from magic-render package
// but it requries magic-render to export as CommonJS with traget "node" just for this one case
// it's cheaper to just copy enum CreatorTool from the magic-render package and place it here
export enum CreatorTool {
  SelectAsset = 0,
  DrawBezierCurve = 1,
  SelectNode = 2,
  Text = 3,
}
