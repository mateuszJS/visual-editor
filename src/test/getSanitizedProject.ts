import { ApiProjectContent } from '../../apiTypes'

export const getSanitizedProject = (): ApiProjectContent => ({
  id: '1', // so it's compatible with server-handlers.ts create project endpoint with id 1
  assets: [],
  updatedAt: new Date().toISOString(),
  width: 500,
  height: 500,
})
