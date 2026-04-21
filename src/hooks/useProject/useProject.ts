'use client'

import { useEffect, useRef } from 'react'
import useFetcher from '@/hooks/useFetcher/useFetcher'
import { proxyMap, proxySet } from 'valtio/utils'
import { ref, useSnapshot } from 'valtio'
import { ApiProjectContent } from '../../../apiTypes'

export const projectsStore = proxyMap<string, ApiProjectContent>()
export const loadersStore = proxySet<string>()

export default function useProject(id?: string) {
  const newProjId = useRef<string | undefined>(undefined)
  const projects = useSnapshot(projectsStore)
  const { error, loading, fetcher } = useFetcher<ApiProjectContent>()

  useEffect(() => {
    if (id && !projectsStore.has(id) && !loadersStore.has(id)) {
      loadersStore.add(id)

      fetcher(`/api/projects/${id}`, (project) => {
        projectsStore.set(id, ref(project))
        loadersStore.delete(id)
      })
    }
  }, [id])

  function createProject(
    width: number,
    height: number,
    successCallback: (project: ApiProjectContent) => void
  ) {
    fetcher(
      '/api/projects',
      {
        method: 'POST',
        json: {
          width,
          height,
          assets: [],
          updatedAt: new Date().toISOString(),
        },
      },
      (project) => {
        projectsStore.set(project.id, ref(project))
        newProjId.current = project.id
        successCallback(project)
      }
    )
  }

  const projectId = id || newProjId.current

  return {
    loading,
    error,
    project: projectId ? projects.get(projectId) || null : null,
    createProject,
  }
}
