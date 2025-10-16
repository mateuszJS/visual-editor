import type { SerializedOutputAsset } from '@mateuszjs/magic-render'

export type SanitizedUser = {
  id: string
  email: string | null
  name: string | null
  avatar: string | null
  projects: string[] | null
}

export type SanitizedAsset = Omit<
  SerializedOutputAsset,
  'id' | 'texture_id' | 'cache_texture_id' | 'sdf_texture_id'
>

export type SanitizedProject = {
  id: string
  owner_id: string
  name: string
  assets: SanitizedAsset[]
  last_updated: string
  height: number | null
  width: number | null
}

export type CreateProjectPayload = Pick<SanitizedProject, 'assets' | 'width' | 'height'>
export type UpdateProjectPayload = Partial<CreateProjectPayload>
export type SanitizedProjectMeta = Omit<SanitizedProject, 'assets'>
