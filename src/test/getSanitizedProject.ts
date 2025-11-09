import { ApiProjectAssetsData } from '../../apiTypes'

export const getSanitizedProject = (): ApiProjectAssetsData => ({
  id: '1', // so it's compatible with server-handlers.ts create project endpoint with id 1
  assets: [],
  updatedAt: new Date().toISOString(),
})
