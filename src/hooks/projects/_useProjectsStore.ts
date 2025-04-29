import type { SanitizedProject } from '@/app/api/utils/sanitizeProjectData'
import { create } from 'zustand'

/**
 * This hook is not meant to be used directly.
 * It's just a shared storage for other proect related hooks.
 */

interface ProjectStore {
  projects: Map<number, SanitizedProject>
  set: (project: SanitizedProject) => void
}

const useProjectsStore = create<ProjectStore>((set) => ({
  projects: new Map(),
  set(project: SanitizedProject) {
    set({ projects: new Map(this.projects).set(project.id, project) })
  },
}))

export default useProjectsStore
