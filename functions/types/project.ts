import { ApiAsset, ApiProjectContent, ApiProjectMetaData } from '../../apiTypes'

export type DB = {
  id: number
  width: number
  height: number
  owner_id: number
  name: string | null
  miniature_updated_at: string | null
  created_at: string
  updated_at: string
  assets: string
}

export function sanitizeContent(
  data: Pick<DB, 'id' | 'assets' | 'updated_at' | 'width' | 'height'> | null
): ApiProjectContent {
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
    id: data.id.toString(),
    assets,
    updatedAt: data.updated_at,
    width: data.width,
    height: data.height,
  }
}

export function sanitizeMetaData(
  data: Pick<DB, 'id' | 'name' | 'created_at' | 'updated_at'> | null
): ApiProjectMetaData {
  if (!data) {
    throw new Error('No data was found.')
  }

  return {
    id: data.id.toString(),
    name: data.name,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  }
}

export type ChangesRaw = {
  width?: number
  height?: number
  assets?: ApiAsset[]
  updatedAt?: string
}

export type ChangesSanitizedDB = Pick<DB, 'width' | 'height' | 'assets' | 'updated_at'>

// throws in case of invalid data
export function sanitizeProjectPayload<R extends boolean>(
  payload: ChangesRaw,
  required: R
): R extends true ? ChangesSanitizedDB : Partial<ChangesSanitizedDB>
export function sanitizeProjectPayload(
  payload: ChangesRaw,
  required: boolean
): ChangesSanitizedDB | Partial<ChangesSanitizedDB> {
  const changes: Partial<ChangesSanitizedDB> = {}

  if (typeof payload.width === 'number') {
    if (payload.width < 1 || payload.width > 3000) {
      throw Error('Width of the project has to be between 1 and 3000 pixels')
    }
    changes.width = payload.width
  } else if (required) {
    throw Error('Width is required')
  }

  if (typeof payload.height === 'number') {
    if (payload.height < 1 || payload.height > 3000) {
      throw Error('Height of the project has to be between 1 and 3000 pixels')
    }
    changes.height = payload.height
  } else if (required) {
    throw Error('Height is required')
  }

  if (payload.assets) {
    if (!Array.isArray(payload.assets)) {
      throw Error('Assets must be an array')
    }
    try {
      changes.assets = JSON.stringify(payload.assets)
    } catch (err) {
      throw Error('Failed to parse assets')
    }
  } else if (required) {
    throw Error('Assets are required')
  }

  if (Object.keys(changes).length === 0) {
    throw Error('No valid fields to update')
  }

  if (typeof payload.updatedAt === 'string') {
    try {
      changes.updated_at = new Date(payload.updatedAt).toISOString()
    } catch (err) {
      throw Error('Invalid updatedAt date')
    }
  } else {
    // update at is mandatory, always
    throw Error('updatedAt is required')
  }

  return changes
}
