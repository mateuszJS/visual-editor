import { projectsStore } from '@/hooks/useProject/useProject'
import { projectsListStore } from '@/hooks/useProjectsList/useProjectsList'
import errorStore from '@/stores/error'
import { captureError } from '@/utils/captureError'
import nativeFetcher from '@/utils/nativeFetcher'

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

    try {
      const response = await nativeFetcher('/api/projects/' + id, { method: 'DELETE' })
      if (!response.ok) {
        onError()
      }
    } catch (err) {
      captureError(err)
      onError()
    }
  }

  return deleteProject
}
