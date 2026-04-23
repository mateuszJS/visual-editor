import { ApiStorageItem } from '../../apiTypes'

export type DB = {
  id: string
  storage_id: string
  preview_id: string
  size: number
  hash: string
  type: string
  name: string | null
  owner_id: string
  updated_at: string
  public: number
}

export function toAPI(
  data: Pick<DB, 'id' | 'size' | 'hash' | 'type' | 'updated_at' | 'public' | 'name'> | null
): ApiStorageItem {
  if (!data) {
    throw new Error('No data was found.')
  }

  return {
    id: data.id,
    type: data.type,
    updatedAt: new Date(data.updated_at).toISOString(),
    public: Boolean(data.public),
    size: data.size,
    hash: data.hash,
    name: data.name,
  }
}

/**
 * @param data = already VALIDATED ApiStorageItem data
 * @returns data which can be safely stored in database
 */
// export function toDB(data: ApiPayload, ownerId: string): Omit<DB, 'id' | 'created_at'> {
//   return {
//     storage_id: data.storageId,
//     type: data.type,
//     owner_id: ownerId,
//     public: Number(data.public),
//   }
// }
