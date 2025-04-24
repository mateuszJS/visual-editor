'use client'

import type { SanitizedProject } from '@/app/api/utils/sanitizeProjectData'
import fetcher from '@/utils/fetcher'
import { useEffect } from 'react'
import { create } from 'zustand'

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

export default function useProject(id: number) {
  const projectsStore = useProjectsStore()

  useEffect(() => {
    if (projectsStore.projects.has(id)) return

    fetcher(`/api/projects/${id}`)
      .then((response) => response.json())
      .then((project: SanitizedProject) => {
        projectsStore.set(project)
      })
      .catch((error) => {
        console.error('Error fetching project:', error)
      })
  }, [id])

  return projectsStore.projects.get(id)
}
