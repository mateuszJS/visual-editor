import type { Asset } from '@mateuszjs/magic-render'

export type ApiAsset = Omit<Asset, 'id' | 'texture_id' | 'cache_texture_id' | 'sdf_texture_id'>

export type ApiProjectMetaData = {
  id: string
  name: string | null
  createdAt: string
  updatedAt: string
}

export type ApiProjectContent = {
  id: string
  assets: ApiAsset[]
  updatedAt: string
  width: number
  height: number
}

export type ApiUserBasic = {
  id: string
  email: string | null
  name: string | null
  photo: string | null
}
