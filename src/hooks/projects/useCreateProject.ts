'use client'

import type { SanitizedProject } from '@/app/api/utils/sanitizeProjectData'
import { useEffect } from 'react'
import useProjectsStore from './_useProjectsStore'
import useFetcher from '../useFetcher'

export default function useCreateProject() {
  const projectsStore = useProjectsStore()
  const { fetcher, loading, success, error } = useFetcher<SanitizedProject>()

  useEffect(() => {
    if (success) {
      projectsStore.set(success.json)
    }
  }, [success])

  function createProject(width: number, height: number, assets: HTMLImageElement[]) {
    fetcher('/api/projects', {
      method: 'POST',
      json: {
        width,
        height,
        assets,
      },
    })
  }

  return {
    createProject,
    loading,
    project: success?.json ?? null,
    error,
  }
}
