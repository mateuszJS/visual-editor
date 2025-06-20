'use client'

import { SanitizedProject } from '@/app/api/utils/sanitizeProjectData'
import useProject from '@/hooks/useProject/useProject'
import initMagicRender from '@mateuszjs/magic-render'
import { proxy, ref, useSnapshot } from 'valtio'

type MagicRender = Awaited<ReturnType<typeof initMagicRender>>

interface CreatorStore {
  creator: MagicRender | null
  projectId: string | null
}

const creatorState = proxy<CreatorStore>({
  creator: null,
  projectId: null,
})

/*
  Hook to be used whenever reference to the creator is needed, like in many Tollbox components.
  Cannot accept any arguments because might be used in a very deep nested component inside creator view.
*/

function useCreator() {
  const stateSnapshot = useSnapshot(creatorState)
  const { updateProject } = useProject()

  return {
    isReady: !!stateSnapshot.creator,
    get creator() {
      if (stateSnapshot.creator === null) throw new Error('Creator is not initialized')
      return stateSnapshot.creator
    },
    get projectId() {
      if (stateSnapshot.projectId === null) throw new Error('Project id is not initialized')
      return stateSnapshot.projectId
    },
    async init(canvas: HTMLCanvasElement, project: SanitizedProject) {
      if (canvas.hasAttribute('data-connected')) return
      // is already connected to the creator
      // and we assume that canvas is mounted to DOM

      canvas.setAttribute('data-connected', '')

      const creator = await initMagicRender(canvas, project.assets, (assets) => {
        updateProject(project.id, { assets })
      })
      // check if canvas is still used(user might already left the page)
      // and destory cannot be called before creator is initialized

      if (canvas.isConnected) {
        creatorState.creator = ref(creator)
        creatorState.projectId = project.id
      } else {
        creator.destroy()
      }
    },
    destroy(canvas: HTMLCanvasElement) {
      if (!canvas.isConnected) {
        // canvas is still rendered, mainly because react in strict mode calls useEffect twice
        creatorState.creator?.destroy()
        creatorState.creator = null
        creatorState.projectId = null
      }
    },
  }
}

export default useCreator
