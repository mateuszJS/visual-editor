import { ApiStorageItem } from '../../apiTypes'

export type DB = {
  id: string
  storage_id: string
  type: string
  owner_id: string
  updated_at: string
  public: number
}

export function toAPI(
  data: Pick<DB, 'id' | 'storage_id' | 'type' | 'updated_at' | 'public' | 'owner_id'> | null
): ApiStorageItem {
  if (!data) {
    throw new Error('No data was found.')
  }

  return {
    id: data.id,
    storageId: data.storage_id,
    type: data.type,
    updatedAt: data.updated_at,
    public: Boolean(data.public),
    ownerId: data.owner_id,
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
