export {}

declare module '@mateuszjs/magic-render' {
  type CanvasImitation = {
    toBlob: (cb: (blob: Blob | null) => void) => void
  }
  export function __triggerSelectAsset(assetId: [number, number, number, number]): void
  export function __triggerPreviewUpdate(canvas: CanvasImitation): void
}
