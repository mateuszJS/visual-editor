// export * from '@mateuszjs/magic-render/types'

// we could import actual exports from magic-render package
// but it requries magic-render to export as CommonJS with traget "node" just for this one case
// it's cheaper to just copy enum CreatorTool from the magic-render package and place it here
export enum CreatorTool {
  SelectAsset = 0,
  DrawBezierCurve = 1,
  SelectNode = 2,
  Text = 3,
}
