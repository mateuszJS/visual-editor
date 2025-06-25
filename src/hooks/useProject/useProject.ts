'use client'

import type { SanitizedProject } from '@/app/api/utils/sanitizeProjectData'
import { useEffect, useRef } from 'react'
import useFetcher from '../useFetcher'
import nativeFetcher from '@/utils/fetcher'
import { UpdateProjectPayload } from '@/app/api/utils/projectSchema'
import { proxyMap } from 'valtio/utils'
import { ref, useSnapshot } from 'valtio'

const projectsStore = proxyMap<string, SanitizedProject>()

async function updateProject(id: string, project: UpdateProjectPayload) {
  if (!projectsStore.has(id)) {
    throw Error(`Project with id ${id} does not exist in the store`)
  }

  try {
    await nativeFetcher(`/api/projects/${id}`, {
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
  } catch (err) {
    throw Error(`Failed to update project with id ${id}: ${err}`)
  }
}

export default function useProject(id?: string) {
  const newProjId = useRef<string | undefined>(undefined)
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

  function createProject(width: number, height: number) {
    return fetcher('/api/projects', {
      method: 'POST',
      json: {
        width,
        height,
      },
    })
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
