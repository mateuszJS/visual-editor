import type { Asset, Image, Shape, Text } from '@mateuszjs/magic-render/types'
import type { ApiAsset } from '../../../apiTypes'

type SerializedOutputAssetMerged = Image & Shape & Text // this type only exist to allow fields removal that might not exist on all variants of the union

export default function serializeAssets(assets: Asset[]): ApiAsset[] {
  return (assets as SerializedOutputAssetMerged[]).map(
    // due to the nature of TypeScript, we cannot deny properties while doing spread operator
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ({ id, texture_id, cache_texture_id, sdf_texture_id, ...rest }) => rest
  )
}
