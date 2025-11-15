import type {
  SerializedAsset,
  SerializedImage,
  SerializedShape,
  SerializedText,
} from '@mateuszjs/magic-render'
import type { ApiAsset } from '../../../apiTypes'

type SerializedOutputAssetMerged = SerializedImage & SerializedShape & SerializedText // this type only exist to allow fields removal that might not exist on all variants of the union

export default function serializeAssets(assets: SerializedAsset[]) {
  return (assets as SerializedOutputAssetMerged[]).map(
    // due to the nature of TypeScript, we cannot deny properties while doing spread operator
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ({ id, texture_id, cache_texture_id, sdf_texture_id, ...rest }) => rest as unknown as ApiAsset
  )
}
