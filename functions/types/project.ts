import { Asset } from './asset'

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

export type MetaData = {
  id: string
  name: string | null
  created_at: string
  updated_at: string
}

export type AssetsData = {
  id: string
  assets: Asset[]
  updated_at: string
}
export function sanitizeAssetsData(
  data: Pick<DB, 'id' | 'assets' | 'updated_at'> | null
): AssetsData {
  if (!data) {
    throw new Error('No data was found.')
  }

  const assets = (() => {
    try {
      return JSON.parse(data.assets) as Asset[]
    } catch (err) {
      // console.error(err) capture this log in the future
    }
  })()

  if (!assets || !Array.isArray(assets)) {
    throw Error('An issue with assets has occured.')
  }

  return {
    id: data.id.toString(),
    assets,
    updated_at: data.updated_at,
  }
}

export function sanitizeMetaData(
  data: Pick<DB, 'id' | 'name' | 'created_at' | 'updated_at'> | null
): MetaData {
  if (!data) {
    throw new Error('No data was found.')
  }

  return {
    id: data.id.toString(),
    name: data.name,
    created_at: data.created_at,
    updated_at: data.updated_at,
  }
}

export type ChangesRaw = {
  width?: number
  height?: number
  assets?: Asset[]
}

export type ChangesSanitizedDB = {
  width: number
  height: number
  assets: string
}

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

  return changes
}
