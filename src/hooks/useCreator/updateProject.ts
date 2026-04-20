'use client'

import nativeFetcher from '@/utils/nativeFetcher'
import { ref } from 'valtio'
import { ApiProjectContent } from '../../../apiTypes'
import { projectsStore } from '../useProject/useProject'
import throttle from '@/utils/throttle'

type ProjectData = Omit<Partial<ApiProjectContent>, 'id'>

async function sendRequest(id: string, project: ProjectData) {
  if (!projectsStore.has(id)) {
    throw Error(`Project with id ${id} does not exist in the store`)
  }

  try {
    const res = await nativeFetcher(`/api/projects/${id}`, {
      method: 'PATCH',
      json: project,
    })

    if (!res.ok) {
      throw Error('Failed to update project.')
    }
    projectsStore.set(
      id,
      ref({
        ...projectsStore.get(id)!,
        ...project,
      })
    )
  } catch (err) {
    throw Error(`Failed to update project with id ${id}: ${err}`)
  }
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
}
