'use client'

import { useEffect, useRef } from 'react'
import useFetcher from '../useFetcher/useFetcher'
import nativeFetcher from '@/utils/nativeFetcher'
import { proxyMap } from 'valtio/utils'
import { ref, useSnapshot } from 'valtio'
import { ApiProjectAssetsData } from '../../../apiTypes'

const projectsStore = proxyMap<string, ApiProjectAssetsData>()

async function updateProject(id: string, project: Omit<ApiProjectAssetsData, 'id'>) {
  if (!projectsStore.has(id)) {
    throw Error(`Project with id ${id} does not exist in the store`)
  }

  try {
    const res = await nativeFetcher(`/api/projects/${id}`, {
      method: 'PATCH',
      json: project,
    })

    if (!res.ok) {
      throw Error('Failed to update project.')
    }

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

  const { error, loading, fetcher } = useFetcher<ApiProjectAssetsData>()

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
    successCallback: (project: ApiProjectAssetsData) => void
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
