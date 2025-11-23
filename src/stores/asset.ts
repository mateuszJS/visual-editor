import type { PointUV, ProjectSnapshot, ShapeProps, TypoProps } from '@mateuszjs/magic-render'
import { proxy } from 'valtio'

interface AssetStore {
  bounds: PointUV[] | null
  props: ShapeProps | null
  typoProps: TypoProps | null
}
export const assetState = proxy<AssetStore>({
  bounds: null,
  props: null,
  typoProps: null,
})

export function updateSelectedAssetStore(
  snapshot: ProjectSnapshot,
  selectedAssetId: number | null
) {
  assetState.bounds = null
  assetState.props = null
  assetState.typoProps = null

  const asset = snapshot.assets.find((a) => a.id === selectedAssetId)

  if (!asset) return

  if (asset.bounds === undefined) throw new Error('Asset bounds are undefined')

  assetState.bounds = asset.bounds

  if ('props' in asset) {
    assetState.props = asset.props
  }

  if ('typo_props' in asset) {
    assetState.typoProps = asset.typo_props || null
  }
}
