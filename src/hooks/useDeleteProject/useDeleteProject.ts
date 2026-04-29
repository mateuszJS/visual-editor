import { projectsStore } from '@/hooks/useProject/useProject'
import { projectsListStore } from '@/hooks/useProjectsList/useProjectsList'
import errorStore from '@/stores/error'
import { captureError } from '@/utils/captureError'
import fetcher from '@/utils/fetcher'

export default function useDeleteProject() {
  const deleteProject = async (id: string) => {
    // use in the case of optimistic repsonse failure
    const safeCopyDetails = projectsStore.get(id)
    const safeCopyList = projectsListStore.projects.get(id)

    projectsStore.delete(id)
    projectsListStore.projects.delete(id)

    const onError = () => {
      errorStore.message = 'An error has occured while removing the project. Please try again.'

      if (safeCopyDetails) {
        projectsStore.set(id, safeCopyDetails)
      }
      if (safeCopyList) {
        projectsListStore.projects.set(id, safeCopyList)
      }
    }

    const response = await fetcher('/api/projects/' + id, { method: 'DELETE' })
    if ('err' in response) {
      captureError(Error(response.err))
      onError()
    }
  }

  return deleteProject
}
