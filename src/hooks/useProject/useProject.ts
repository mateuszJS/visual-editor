'use client'

import { useEffect, useRef, useState } from 'react'
import { proxyMap, proxySet } from 'valtio/utils'
import { ref, useSnapshot } from 'valtio'
import { ApiProjectContent } from '../../../apiTypes'
import fetcher from '@/utils/fetcher'
import errorStore from '@/stores/error'

export const projectsStore = proxyMap<string, ApiProjectContent>()
export const loadersStore = proxySet<string>()

export default function useProject(id?: string) {
  const newProjId = useRef<string | undefined>(undefined)
  const projects = useSnapshot(projectsStore)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (id && !projectsStore.has(id) && !loadersStore.has(id)) {
      const sendRequest = async () => {
        loadersStore.add(id)
        setLoading(true)
        const response = await fetcher<ApiProjectContent>(`/api/projects/${id}`)

        if ('err' in response) {
          if (response.status !== 401) {
            errorStore.message =
              response.err || 'Something went wrong while fetching the project. Please try again.'
          }
        } else {
          projectsStore.set(id, ref(response.json))
          loadersStore.delete(id)
        }

        setLoading(false)
      }

      sendRequest()
    }
  }, [id])

  async function createProject(
    width: number,
    height: number,
    successCallback: (project: ApiProjectContent) => void
  ) {
    setLoading(true)
    const response = await fetcher<ApiProjectContent>('/api/projects', {
      method: 'POST',
      json: {
        width,
        height,
        assets: [],
        updatedAt: new Date().toISOString(),
      },
    })

    if ('err' in response) {
      errorStore.message =
        response.err || 'Something went wrong while creating project. Please try again.'
    } else {
      const project = response.json
      projectsStore.set(project.id, ref(project))
      newProjId.current = project.id
      successCallback(project)
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
