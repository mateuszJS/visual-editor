'use client'

import { UpdateProjectPayload } from '@/app/api/utils/projectSchema'
import { SanitizedProject } from '@/app/api/utils/sanitizeProjectData'
import fetcher from '@/utils/fetcher'
import initMagicRender from '@mateuszjs/magic-render'
import { create } from 'zustand'
import { proxy, useSnapshot } from 'valtio'

type MagicRender = Awaited<ReturnType<typeof initMagicRender>>

interface CreatorStore {
  creator: MagicRender | null
  projectId: string | null
}

function onProjectUpdate(id: number, project: UpdateProjectPayload) {
  fetcher(`/api/projects/${id}`, {
    method: 'PATCH',
    json: project,
  })
}

const creatorState = proxy<CreatorStore>({
  creator: null,
  projectId: null,
})

// const stores: CreatorStore[] = []

function useCreator() {
  const store = useSnapshot(creatorState)
  // console.log('useCreator - render', { ...store })
  // stores.push(store)
  return {
    isReady: !!store.creator,
    get creator() {
      if (store.creator === null) throw new Error('Creator is not initialized')
      return store.creator
    },
    get projectId() {
      if (store.projectId === null) throw new Error('Project id is not initialized')
      return store.projectId
    },
    async init(canvas: HTMLCanvasElement, project: SanitizedProject) {
      console.log('useCreator - init')
      if (canvas.hasAttribute('data-connected')) return
      // is already connected to the creator
      // and we assume that canvas is mounted to DOM

      canvas.setAttribute('data-connected', '')
      console.log('useCreator - initMagicRender')
      const creator = await initMagicRender(canvas, project.assets, (assets) =>
        onProjectUpdate(project.id, { assets })
      )

      // check if canvas is still used(user might already left the page)
      // and destory cannot be called before creator is initialized
      // console.log('useCreator - initMagicRender - done', canvas.isConnected)
      if (canvas.isConnected) {
        creatorState.creator = creator
        creatorState.projectId = project.id.toString()
      } else {
        creator.destroy()
      }
    },
    destroy(canvas: HTMLCanvasElement) {
      console.log('useCreator - destroyyyyyyyyyyyyyyyyyy', store.creator)

      // stores.forEach((s, i) => {
      //   const prevI = i === 0 ? stores.length - 1 : i - 1
      //   console.log(prevI, i, s === stores[prevI])
      // })
      // console.log('areTheSame', stores)
      if (!canvas.isConnected) {
        // canvas is still rendered, mainly because react in strict mode calls useEffect twice
        store.creator?.destroy()
        creatorState.creator = null
        creatorState.projectId = null
      }
    },
  }
}

export default useCreator
