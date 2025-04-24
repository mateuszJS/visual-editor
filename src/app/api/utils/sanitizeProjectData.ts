import type { Tables } from '@/app/api/supabaseClient/database.types'

export type SanitizedProject = Pick<
  Tables<'projects'>,
  'id' | 'name' | 'assets' | 'last_updated' | 'height' | 'width' | 'owner_id'
>

export default function sanitizeProjectData(data: Tables<'projects'>): SanitizedProject {
  return {
    id: data.id,
    name: data.name,
    assets: data.assets,
    last_updated: data.last_updated,
    height: data.height,
    width: data.width,
    owner_id: data.owner_id,
  }
}
