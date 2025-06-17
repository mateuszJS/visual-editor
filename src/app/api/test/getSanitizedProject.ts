import { SanitizedProject } from '../utils/sanitizeProjectData'

export const getSanitizedProject = (): SanitizedProject => ({
  id: 0,
  name: 'Test Project',
  assets: [],
  height: 100,
  width: 100,
  owner_id: 0,
  last_updated: new Date().toISOString(),
})
