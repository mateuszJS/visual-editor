export type Project = {
  id: number
  width: number
  height: number
  owner_id: number
  name: string | null
  miniature_created_at: string | null
  created_at: string
  last_updated: string
  assets: string
}

export type ProjectMeta = Pick<Project, 'id' | 'name' | 'created_at' | 'last_updated'>

export type ProjectAssets = Pick<Project, 'id' | 'assets'>
