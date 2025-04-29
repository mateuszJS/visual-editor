'use client'

import type { SanitizedProject } from '@/app/api/utils/sanitizeProjectData'
import { useEffect } from 'react'
import useProjectsStore from './_useProjectsStore'
import useFetcher from '../useFetcher'

export default function useProject(id: number) {
  const projectsStore = useProjectsStore()
  const { success, error, loading, fetcher } = useFetcher<SanitizedProject>()

  useEffect(() => {
    if (projectsStore.projects.has(id)) return

    fetcher(`/api/projects/${id}`)
  }, [id])

  useEffect(() => {
    if (success) {
      projectsStore.set(success.json)
    }
  }, [success])

  return {
    loading,
    error,
    project: projectsStore.projects.get(id) || null,
  }
}
