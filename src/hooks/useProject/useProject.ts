'use client'

import { useEffect, useRef } from 'react'
import useFetcher from '../useFetcher/useFetcher'
import nativeFetcher from '@/utils/fetcher'
import { proxyMap } from 'valtio/utils'
import { ref, useSnapshot } from 'valtio'
import { SanitizedProject, UpdateProjectPayload } from '@/types'

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

  const { error, loading, fetcher } = useFetcher<SanitizedProject>()

  useEffect(() => {
    if (id && !projectsStore.has(id)) {
      fetcher(`/api/projects/${id}`, (project) => {
        projectsStore.set(id, ref(project))
      })
    }
  }, [id])

  function createProject(
    width: number,
    height: number,
    successCallback: (project: SanitizedProject) => void
  ) {
    fetcher(
      '/api/projects',
      {
        method: 'POST',
        json: {
          width,
          height,
          assets: [],
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
    updateProject,
  }
}
