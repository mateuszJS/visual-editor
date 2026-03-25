import { useEffect } from 'react'
import useFetcher from '../useFetcher/useFetcher'
import { proxyMap } from 'valtio/utils'
import { useSnapshot } from 'valtio'
import { ApiProjectMetaData } from '../../../apiTypes'
import errorStore from '@/stores/error'

const projectsListStore = proxyMap<string, ApiProjectMetaData>()

export default function useProjectsList() {
  const { error, loading, fetcher } = useFetcher<ApiProjectMetaData[]>()
  const projectsList = useSnapshot(projectsListStore)

  useEffect(() => {
    fetcher(`/api/projects`, (projects) => {
      projects.forEach((project) => {
        projectsListStore.set(project.id, project)
      })
    })
  }, [])

  useEffect(() => {
    errorStore.message = error
  }, [error])

  return {
    loading: loading && projectsList.size === 0,
    error,
    projectsList,
  }
}
