'use client'

import type { SanitizedProjectMeta } from '@/app/api/utils/sanitizeProjectMetaData'
import { useEffect } from 'react'
import useFetcher from '../useFetcher'
import { proxyMap } from 'valtio/utils'
import { useSnapshot } from 'valtio'

const projectsListStore = proxyMap<string, SanitizedProjectMeta>()

export default function useProjectsList() {
  const { success, error, loading, fetcher } = useFetcher<SanitizedProjectMeta[]>()
  const projectsList = useSnapshot(projectsListStore)

  useEffect(() => {
    fetcher(`/api/projects`)
  }, [])

  useEffect(() => {
    if (success?.json) {
      success.json.forEach((project) => {
        projectsListStore.set(project.id, project)
      })
    }
  }, [success])

  return {
    loading,
    error,
    projectsList,
  }
}
