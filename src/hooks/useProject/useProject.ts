'use client'

import type { SanitizedProject } from '@/app/api/utils/sanitizeProjectData'
import { useEffect, useRef } from 'react'
import useFetcher from '../useFetcher/useFetcher'
import nativeFetcher from '@/utils/fetcher'
import { UpdateProjectPayload } from '@/app/api/utils/projectSchema'
import { proxyMap } from 'valtio/utils'
import { ref, useSnapshot } from 'valtio'
import getFirebase from '@/utils/getFirebase'
import { addDoc, collection, doc, serverTimestamp } from 'firebase/firestore'

const projectsStore = proxyMap<string, SanitizedProject>()

async function updateProject(id: string, project: UpdateProjectPayload) {
  if (!projectsStore.has(id)) {
    throw Error(`Project with id ${id} does not exist in the store`)
  }

  try {
    await nativeFetcher(`/api/projects/${id}`, {
      method: 'PATCH',
      json: project,
    })
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

export default function useProject(id?: string) {
  const newProjId = useRef<string | undefined>(undefined)
  const projects = useSnapshot(projectsStore)

  const { error, loading, fetcher } = useFetcher<SanitizedProject>()

  useEffect(() => {
    if (id && !projectsStore.has(id)) {
      fetcher(`/api/projects/${id}`, (project) => {
        projectsStore.set(id, ref(project))
      })
    }
  }, [id])

  async function createProject(
    width: number,
    height: number,
    successCallback: (project: SanitizedProject) => void
  ) {
    // setDoc(cityRef, { capital: true }, { merge: true });
    // OR
    // Set the "capital" field of the city 'DC'
    // await updateDoc(washingtonRef, {
    //   capital: true
    // });
    try {
      const docRef = await addDoc(collection(getFirebase().firestore, 'projects'), {
        width,
        height,
        // createdAt: serverTimestamp(),
        // owner: getFirebase().auth.currentUser?.uid || null,
      })
      console.log(docRef)
    } catch (err) {
      console.log('Error adding document: ', err)
    }

    // fetcher(
    //   '/api/projects',
    //   {
    //     method: 'POST',
    //     json: {
    //       width,
    //       height,
    //     },
    //   },
    //   (project) => {
    //     projectsStore.set(project.id, ref(project))
    //     newProjId.current = project.id
    //     successCallback(project)
    //   }
    // )
  }

  const projectId = id || newProjId.current

  return {
    loading,
    error,
    project: projectId ? projects.get(projectId) || null : null,
    createProject,
    updateProject,
  }
}
