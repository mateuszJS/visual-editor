import type { Asset } from '@mateuszjs/magic-render/types'

export type ApiAsset = Omit<Asset, 'id' | 'texture_id' | 'cache_texture_id' | 'sdf_texture_id'>

export type ApiProjectMetaData = {
  id: string
  name: string | null
  updatedAt: string
}

export type ApiProjectContent = ApiProjectMetaData & {
  assets: ApiAsset[]
  width: number
  height: number
}

export type ApiTemplateMetaData = {
  id: string
  name: string
  createdAt: string
  previewShape: 'SQUARE' | 'L' | '2v' | '3v' | '2h' | '3h'
}

export type ApiTemplateContent = ApiTemplateMetaData & {
  assets: ApiAsset[]
  width: number
  height: number
}

export type ApiUserBasic = {
  id: string
  email: string
  name: string | null
  photo: string | null
}

export type ApiStorageItem = {
  id: string
  size: number
  hash: string
  type: string
  updatedAt: string
  public: boolean
  name: string | null
}
