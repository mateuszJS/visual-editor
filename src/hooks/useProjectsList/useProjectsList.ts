import { useEffect } from 'react'
import useFetcher from '../useFetcher/useFetcher'
import { proxyMap } from 'valtio/utils'
import { proxy, useSnapshot } from 'valtio'
import { ApiProjectMetaData } from '../../../apiTypes'
import errorStore from '@/stores/error'

const PROJECTS_LIST_TTL = 1000 * 60 * 60 * 1 // 1 hour

export const projectsListStore = proxy({
  initializedAt: 0,
  isRequesting: false,
  projects: proxyMap<string, ApiProjectMetaData>(),
})

export default function useProjectsList() {
  const { error, fetcher } = useFetcher<ApiProjectMetaData[]>()
  const projectsList = useSnapshot(projectsListStore)

  useEffect(() => {
    const isOutdated = Date.now() - projectsList.initializedAt > PROJECTS_LIST_TTL

    if (isOutdated && !projectsList.isRequesting) {
      projectsListStore.isRequesting = true

      fetcher(`/api/projects`, (projects) => {
        projects.forEach((project) => {
          projectsListStore.projects.set(project.id, project)
        })

        projectsListStore.initializedAt = Date.now()
        projectsListStore.isRequesting = false
      })
    }
  }, [])

  useEffect(() => {
    errorStore.message = error
  }, [error])

  return {
    loading: !error && projectsList.initializedAt === 0,
    error,
    projectsList: projectsList.projects,
  }
}
