import { useEffect } from 'react'
import { proxy, useSnapshot } from 'valtio'
import { ApiProjectMetaData } from '../../../apiTypes'
import fetcher from '@/utils/fetcher'
import { captureError } from '@/utils/captureError'

export const projectsListStore = proxy({
  initialized: false,
  loading: false,
  error: null as null | string,
  projects: [] as ApiProjectMetaData[],
})

export async function initializeProjectsList() {
  if (projectsListStore.loading) return

  projectsListStore.initialized = true
  projectsListStore.loading = true
  projectsListStore.error = null

  const response = await fetcher<ApiProjectMetaData[]>('/api/projects')
  projectsListStore.loading = false

  if ('err' in response) {
    projectsListStore.error = response.err || "Couldn't fetch your projects. Please try again."
    captureError(response.err)
    return
  }

  projectsListStore.projects = response.json.toSorted(sortProjByUpdatedAt)
  projectsListStore.error = null
}

export default function useProjectsList() {
  const { error, loading, projects, initialized } = useSnapshot(projectsListStore)

  useEffect(() => {
    const intervalId = setInterval(initializeProjectsList, 1000 * 60 * 60 * 12 /* every 12 horus */)

    return () => {
      clearInterval(intervalId)
    }
  }, [])

  return {
    loading: initialized === false || loading,
    error,
    projectsList: projects,
  }
}

function sortProjByUpdatedAt(a: ApiProjectMetaData, b: ApiProjectMetaData) {
  if (a.updatedAt < b.updatedAt) return 1
  if (a.updatedAt > b.updatedAt) return -1
  return 0
}
