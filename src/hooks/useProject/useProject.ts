'use client'

import { useEffect, useRef, useState } from 'react'
import { proxyMap, proxySet } from 'valtio/utils'
import { ref, useSnapshot } from 'valtio'
import { ApiProjectContent } from '../../../apiTypes'
import nativeFetcher from '@/utils/nativeFetcher'
import errorStore from '@/stores/error'

export const projectsStore = proxyMap<string, ApiProjectContent>()
export const loadersStore = proxySet<string>()

export default function useProject(id?: string) {
  const newProjId = useRef<string | undefined>(undefined)
  const projects = useSnapshot(projectsStore)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (id && !projectsStore.has(id) && !loadersStore.has(id)) {
      loadersStore.add(id)
      setLoading(true)
      nativeFetcher(`/api/projects/${id}`).then((res) => {
        if (res.ok) {
          projectsStore.set(id, ref(res.json))
          loadersStore.delete(id)
        } else {
          errorStore.message =
            res.json?.error || 'Something went wrong while fetching the project. Please try again.'
        }
        setLoading(false)
      })
    }
  }, [id])

  async function createProject(
    width: number,
    height: number,
    successCallback: (project: ApiProjectContent) => void
  ) {
    setLoading(true)
    const response = await nativeFetcher<ApiProjectContent>('/api/projects', {
      method: 'POST',
      json: {
        width,
        height,
        assets: [],
        updatedAt: new Date().toISOString(),
      },
    })

    if (response.ok) {
      const project = response.json
      projectsStore.set(project.id, ref(project))
      newProjId.current = project.id
      successCallback(project)
    } else {
      errorStore.message =
        response.json?.error || 'Something went wrong while creating project. Please try again.'
    }
    setLoading(false)
  }

  const projectId = id || newProjId.current

  return {
    loading,
    project: projectId ? projects.get(projectId) || null : null,
    createProject,
  }
}
