import { useEffect } from 'react'
import { proxyMap } from 'valtio/utils'
import { proxy, useSnapshot } from 'valtio'
import { ApiProjectMetaData } from '../../../apiTypes'
import errorStore from '@/stores/error'
import nativeFetcher from '@/utils/nativeFetcher'

export const projectsListStore = proxy({
  loading: false,
  error: null as null | string,
  projects: proxyMap<string, ApiProjectMetaData>(),
})

export async function initializeProjectsList() {
  if (projectsListStore.loading) return
  projectsListStore.loading = true
  projectsListStore.error = null

  const response = await nativeFetcher<ApiProjectMetaData[]>('/api/projects')

  if (response.ok) {
    response.json.toSorted(sortProjByUpdatedAt).forEach((project) => {
      projectsListStore.projects.set(project.id, project)
    })
    projectsListStore.error = null
  } else {
    projectsListStore.error = response.json?.error || 'Something went wrong.'
  }

  projectsListStore.loading = false
}

export default function useProjectsList() {
  const { error, loading, projects } = useSnapshot(projectsListStore)

  useEffect(() => {
    if (error) {
      console.log('useEffect', error)
      errorStore.message = error
      projectsListStore.error = null
    }

    const intervalId = setInterval(initializeProjectsList, 1000 * 60 * 60 * 12 /* every 12 horus */)

    return () => {
      clearInterval(intervalId)
    }
  }, [error])

  return {
    loading,
    error,
    projectsList: projects,
  }
}

function sortProjByUpdatedAt(a: ApiProjectMetaData, b: ApiProjectMetaData) {
  if (a.updatedAt < b.updatedAt) return 1
  if (a.updatedAt > b.updatedAt) return -1
  return 0
}
