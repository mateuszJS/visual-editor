export type ApiAsset = Record<string, string | number | null | boolean | ApiAsset[]>

export type ApiProjectMetaData = {
  id: string
  name: string | null
  createdAt: string
  updatedAt: string
}

export type ApiProjectAssetsData = {
  id: string
  assets: ApiAsset[]
  updatedAt: string
}

export type ApiUserBasic = {
  id: string
  email: string | null
  name: string | null
  photo: string | null
}
