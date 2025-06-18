import type { Tables } from '@/app/api/supabaseClient/database.types'
import { SerializedAsset } from '@mateuszjs/magic-render'

export type SanitizedProject = Pick<
  Tables<'projects'>,
  'id' | 'name' | 'last_updated' | 'height' | 'width' | 'owner_id'
> & { assets: SerializedAsset[] } // we override 'assets' property here, since is just have Json[] type in db
// > & { id: string; assets: SerializedAsset[] } // we override 'assets' property here, since is just have Json[] type in db

export default function sanitizeProjectData(data: Tables<'projects'>): SanitizedProject {
  return {
    id: data.id,
    // id: data.id.toString(),
    name: data.name,
    assets: data.assets as SerializedAsset[],
    last_updated: data.last_updated,
    height: data.height,
    width: data.width,
    owner_id: data.owner_id,
  }
}
