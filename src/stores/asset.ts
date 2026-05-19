import type {
  PointUV,
  ProjectSnapshot,
  BasicProps,
  TypoProps,
  Program,
  ProgramInputs,
} from '@mateuszjs/magic-render/types'
import { proxy, ref } from 'valtio'

interface AssetStore {
  bounds: PointUV[] | null
  props: BasicProps | null
  program: Program | null
  inputs: ProgramInputs | null
  typoProps: TypoProps | null
}
export const assetState = proxy<AssetStore>({
  bounds: null,
  props: null,
  program: null,
  inputs: null,
  typoProps: null,
})

export function resetAssetStore() {
  assetState.bounds = null
  assetState.props = null
  assetState.program = null
  assetState.inputs = null
  assetState.typoProps = null
}

export function updateSelectedAssetStore(
  snapshot: ProjectSnapshot,
  selectedAssetId: number | null
) {
  resetAssetStore()

  const asset = snapshot.assets.find((a) => a.id === selectedAssetId)

  if (!asset) return

  if (asset.bounds === undefined) throw new Error('Asset bounds are undefined')

  assetState.bounds = ref(asset.bounds)

  if ('props' in asset) {
    assetState.props = ref(asset.props)
  }

  if ('typo_props' in asset) {
    assetState.typoProps = ref(asset.typo_props) || null
  }

  if ('program' in asset) {
    assetState.program = ref(asset.program)
  }

  if ('inputs' in asset) {
    assetState.inputs = ref(asset.inputs)
  }
}
