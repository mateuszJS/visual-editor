'use client'

import fetcher from '@/utils/fetcher'
import { ref } from 'valtio'
import { ApiProjectContent } from '../../../apiTypes'
import { projectsStore } from '../useProject/useProject'
import throttle from '@/utils/throttle'
import { captureError } from '@/utils/captureError'
import { projectsListStore } from '../useProjectsList/useProjectsList'

type ProjectData = Omit<ApiProjectContent, 'id' | 'name'>

async function sendRequest(id: string, project: ProjectData) {
  if (!projectsStore.has(id)) {
    captureError(new Error(`Project with id ${id} does not exist in the store`))
  }

  const response = await fetcher(`/api/projects/${id}`, {
    method: 'PATCH',
    json: project,
  })

  if ('err' in response) {
    // We send many updates in the background, it's possible osme might fail, we don't have to notify user about it
    captureError(new Error(response.err))
    return
  }

  projectsStore.set(
    id,
    ref({
      ...projectsStore.get(id)!,
      ...project,
    })
  )
}

let projectToUpdate = null as { id: string; data: ProjectData } | null
export const alternativeProjectUpdate = () => {
  if (projectToUpdate) {
    sendRequest(projectToUpdate.id, projectToUpdate.data)
    projectToUpdate = null
  }
}

const throttleProjectUpdate = throttle(alternativeProjectUpdate, 1000 * 10)

export function updateProject(id: string, data: ProjectData) {
  if (navigator.serviceWorker.controller) {
    sendRequest(id, data)
    projectToUpdate = null
  } else {
    projectToUpdate = { id, data }
    throttleProjectUpdate()
  }

  const projectList = projectsListStore.projects.get(id)
  if (projectList) {
    projectList.updatedAt = data.updatedAt
  }
}
