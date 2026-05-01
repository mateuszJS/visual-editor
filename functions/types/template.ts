import { ApiAsset, ApiTemplateContent, ApiTemplateMetaData } from '../../apiTypes'

export type DB = {
  id: string
  width: number
  height: number
  name: string
  created_at: string
  assets: string
  preview_shape: ApiTemplateMetaData['previewShape']
}

export function sanitizeContent(
  data: Pick<
    DB,
    'id' | 'name' | 'created_at' | 'preview_shape' | 'width' | 'height' | 'assets'
  > | null
): ApiTemplateContent {
  if (!data) {
    throw new Error('No data was found.')
  }

  let assets: ApiAsset[]
  try {
    assets = JSON.parse(data.assets) as ApiAsset[]
  } catch (err) {
    throw Error('An issue with assets has occurred.')
  }

  return {
    id: data.id,
    name: data.name,
    createdAt: new Date(data.created_at).toISOString(),
    previewShape: data.preview_shape,
    assets,
    width: data.width,
    height: data.height,
  }
}

export function sanitizeMetaData(
  data: Pick<DB, 'id' | 'name' | 'created_at' | 'preview_shape'> | null
): ApiTemplateMetaData {
  if (!data) {
    throw new Error('No data was found.')
  }

  return {
    id: data.id,
    name: data.name,
    createdAt: new Date(data.created_at).toISOString(),
    previewShape: data.preview_shape,
  }
}
