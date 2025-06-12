'use client'

import initMagicRender from '@mateuszjs/magic-render'
import { create } from 'zustand'

type MagicRender = Awaited<ReturnType<typeof initMagicRender>>

export interface CreatorStore {
  creator: MagicRender | null
  projectId: string | null
  set: (state: Partial<CreatorStore>) => void
}

const useCreatorStore = create<CreatorStore>((set) => ({
  creator: null,
  projectId: null,
  set,
}))

let validCanvas: HTMLCanvasElement | null = null

function useCreator() {
  const store = useCreatorStore()

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
    async init(canvas: HTMLCanvasElement, projectId: string) {
      if (validCanvas === canvas) {
        // Canvas was alreayd lniekd with device, We cannot link one canvas element to multiple devices
        // this issue happens in react strict mode(useEffect is called twice)
        return
      }

      validCanvas = canvas
      const creator = await initMagicRender(canvas)

      // check if it's the same canvas as before the promsie was resolved
      if (validCanvas === canvas) {
        store.set({ creator, projectId })
      } else {
        creator.destroy()
      }
    },
    destroy(canvas: HTMLCanvasElement) {
      if (store.creator) {
        store.creator.destroy() // if initMagicRender takes too long, then created might be requested to destroy before creation
        store.set({ creator: null, projectId: null })
      } else if (validCanvas === canvas) {
        // if canvas was not yet initialized, then make sure listCanvas doesn't points and canvas
        // only lastCanvas will finish initialization completly, other will be immidiately destroyed after their initialization
        validCanvas = null
      }
    },
  }
}

export default useCreator
