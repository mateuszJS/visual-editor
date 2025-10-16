import { useEffect } from 'react'
import useFetcher from '../useFetcher/useFetcher'
import { proxyMap } from 'valtio/utils'
import { useSnapshot } from 'valtio'
import { SanitizedProjectMeta } from '@/types'

const projectsListStore = proxyMap<string, SanitizedProjectMeta>()

export default function useProjectsList() {
  const { error, loading, fetcher } = useFetcher<SanitizedProjectMeta[]>()
  const projectsList = useSnapshot(projectsListStore)

  useEffect(() => {
    fetcher(`/api/projects`, (projects) => {
      projects.forEach((project) => {
        projectsListStore.set(project.id, project)
      })
    })
  }, [])

  return {
    loading,
    error,
    projectsList,
  }
}
