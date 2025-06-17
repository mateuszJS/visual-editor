'use client'

import type { SanitizedProject } from '@/app/api/utils/sanitizeProjectData'
import { useEffect, useRef } from 'react'
import useFetcher from '../useFetcher'
import { UpdateProjectPayload } from '@/app/api/utils/projectSchema'
import { proxyMap } from 'valtio/utils'
import { ref, useSnapshot } from 'valtio'

const projectsStore = proxyMap<number, SanitizedProject>()

export default function useProject(id?: number) {
  const newProjId = useRef<number | undefined>(undefined)
  const projects = useSnapshot(projectsStore)

  const { success, error, loading, fetcher } = useFetcher<SanitizedProject>()
  useEffect(() => {
    if (id && !projectsStore.has(id)) {
      fetcher(`/api/projects/${id}`)
    }
  }, [id])

  useEffect(() => {
    // methods like "update" give success but no json
    if (success?.json?.id && !projectsStore.has(success.json.id)) {
      projectsStore.set(success.json.id, ref(success.json))
      newProjId.current = success.json.id
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

  function updateProject(id: number, project: UpdateProjectPayload) {
    if (!projectsStore.has(id)) {
      throw Error(`Project with id ${id} does not exist in the store`)
    }
    fetcher(`/api/projects/${id}`, {
      method: 'PATCH',
      json: project,
    })
    projectsStore.set(
      id,
      ref({
        ...projectsStore.get(id)!,
        ...project,
      })
    )
  }

  const projectId = id || newProjId.current

  return {
    loading,
    error,
    project: projectId ? projects.get(projectId) || null : null,
    createProject,
    updateProject,
  }
}
