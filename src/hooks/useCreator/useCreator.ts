'use client'

import useProject from '@/hooks/useProject/useProject'
import type {
  CreatorTool,
  ProjectSnapshot,
  Asset,
  TypoProps,
  CreatorAPI,
} from '@mateuszjs/magic-render/types'
import { proxy, ref, useSnapshot } from 'valtio'
import { uploadTexture } from './uploadTexture'
import uploadMiniature from './uploadMiniature'
import { ApiProjectContent } from '../../../apiTypes'
import serializeAssets from './serializeAsset'
import { useRef } from 'react'
import { resetAssetStore, updateSelectedAssetStore } from '@/stores/asset'

// we extract this part to a separate hook since not all components using useCreator need this data
// and this data is going to be updated quite frequently

const DEFAULT_FONTS: Record<string, number> = {
  'Outfit - Variable': 0,
  'EBGaramond - Variable': 1,
  'Shadows Into Light': 2,
  Barriecito: 3,
  'Imperial Script': 4,
  Pacifico: 5,
  Creepster: 6,
}

interface CreatorStore {
  creator: CreatorAPI | null
  projectId: string | null
  initialAssets: { projectId: string; assetUrls: string[] } | null
  selectedAssetId: number | null
  historySnapshots: ProjectSnapshot[]
  historySnapshotIndex: number
  tool: CreatorTool
  fonts: Record<string, number>
}

const creatorState = proxy<CreatorStore>({
  creator: null,
  projectId: null,
  initialAssets: null,
  selectedAssetId: null,
  historySnapshots: [],
  historySnapshotIndex: 0,
  tool: 0, // CreatorTool.SelectAsset,
  fonts: DEFAULT_FONTS,
})

/*
  Hook to be used whenever reference to the creator is needed, like in many Toolbox components.
  Cannot accept any arguments because might be used in a very deep nested component inside creator view.
*/
function useCreator() {
  const stateSnapshot = useSnapshot(creatorState)
  const { updateProject } = useProject()
  const bypassInitialSnapshotRequest = useRef(true)
  // do not send initial snapshot if not needed (the request should be send only when initial assets provided)

  const canUndo = stateSnapshot.historySnapshotIndex > 0
  const canRedo = stateSnapshot.historySnapshots.length - 1 > stateSnapshot.historySnapshotIndex

  function setHistoricSnapshot(snapshotIndex: number) {
    creatorState.historySnapshotIndex = snapshotIndex
    const historySnapshot = stateSnapshot.historySnapshots[snapshotIndex]

    updateProject(stateSnapshot.projectId!, {
      width: historySnapshot.width,
      height: historySnapshot.height,
      assets: serializeAssets(historySnapshot.assets),
      updatedAt: new Date().toISOString(),
    })

    creatorState.creator!.setSnapshot(historySnapshot, false)
    updateSelectedAssetStore(
      creatorState.historySnapshots[creatorState.historySnapshotIndex],
      creatorState.selectedAssetId
    )
  }

  return {
    isReady: !!stateSnapshot.creator,
    selectedAssetId: stateSnapshot.selectedAssetId,
    undo: canUndo ? () => setHistoricSnapshot(stateSnapshot.historySnapshotIndex - 1) : null,
    redo: canRedo ? () => setHistoricSnapshot(stateSnapshot.historySnapshotIndex + 1) : null,
    tool: stateSnapshot.tool,
    fonts: stateSnapshot.fonts,
    get creator() {
      if (stateSnapshot.creator === null) throw new Error('Creator is not initialized')
      return stateSnapshot.creator
    },
    get projectId() {
      if (stateSnapshot.projectId === null) throw new Error('Project id is not initialized')
      return stateSnapshot.projectId
    },
    async init(canvas: HTMLCanvasElement, project: ApiProjectContent) {
      if (canvas.hasAttribute('data-connected')) return
      // is already connected to the creator
      // and we assume that canvas is mounted to DOM

      canvas.setAttribute('data-connected', '')
      const initMagicRender = (await import('@mateuszjs/magic-render')).default
      const creator = await initMagicRender({
        initialProjectWidth: project.width,
        initialProjectHeight: project.height,
        canvas,
        onExternalTextureCreation: async (url, setNewUrl) => {
          if (!url.startsWith('blob:')) return
          const newUrl = await uploadTexture(url)
          if (newUrl === null) return

          setNewUrl(newUrl)
          creatorState.historySnapshots.forEach((snapshot) => {
            snapshot.assets.forEach((asset) => {
              if ('url' in asset && asset.url === url) {
                asset.url = newUrl
              }
            })
          })

          const snapshot = creatorState.historySnapshots[creatorState.historySnapshotIndex]

          updateProject(project.id, {
            width: snapshot.width,
            height: snapshot.height,
            assets: serializeAssets(snapshot.assets),
            updatedAt: new Date().toISOString(),
          })
        },
        onSnapshotUpdate: (snapshot, commit) => {
          updateSelectedAssetStore(snapshot, creatorState.selectedAssetId)

          if (!commit) return

          if (creatorState.historySnapshotIndex < creatorState.historySnapshots.length - 1) {
            creatorState.historySnapshots.splice(creatorState.historySnapshotIndex + 1)
          }

          creatorState.historySnapshots.push(ref(snapshot))
          creatorState.historySnapshotIndex = creatorState.historySnapshots.length - 1

          if (!bypassInitialSnapshotRequest.current) {
            updateProject(project.id, {
              width: snapshot.width,
              height: snapshot.height,
              assets: serializeAssets(snapshot.assets),
              updatedAt: new Date().toISOString(),
            })
          }

          bypassInitialSnapshotRequest.current = false
        },
        onAssetSelect: (assetId) => {
          creatorState.selectedAssetId = assetId[0] || null
          const snapshot = creatorState.historySnapshots[creatorState.historySnapshotIndex]

          if (snapshot) {
            updateSelectedAssetStore(snapshot, creatorState.selectedAssetId)
          }
        },
        onIsProcessingFlagUpdate: () => {},
        onPreviewUpdate: (miniCanvas) => uploadMiniature(miniCanvas, project.id),
        onUpdateTool: (tool) => {
          creatorState.tool = tool
        },
        getFontUrl: (id: number) => {
          // This link is for development purposes only. In production, fonts should be served from a proper storage.
          return `https://pub-dca9f88586314ce2a8a165d963769bf0.r2.dev/${id}.woff`
        },
        isTest: false,
        disableMinaitures: false,
      })

      // verify if canvas is still connected to DOM after creator promise is resolved
      if (canvas.isConnected) {
        creatorState.creator = ref(creator)
        creatorState.projectId = project.id
      } else {
        creator.destroy()
      }

      const { initialAssets } = creatorState
      const hasInitialAssets = initialAssets?.projectId === project.id
      bypassInitialSnapshotRequest.current = !hasInitialAssets

      const initialSnapshot: ProjectSnapshot = {
        width: project.width,
        height: project.height,
        assets: hasInitialAssets
          ? initialAssets.assetUrls.map((url) => ({ url }))
          : (project.assets as Asset[]), // those two types are same
        // just TS cannot infer that
      }

      creatorState.initialAssets = null
      creator.setSnapshot(initialSnapshot, true)
    },
    setProjectSize(width: number, height: number) {
      const creator = stateSnapshot.creator
      if (!creator) throw Error('Creator is not initialized')

      const snapshot = creatorState.historySnapshots[creatorState.historySnapshotIndex]
      creator.setSnapshot({ width, height, assets: snapshot.assets }, true)
    },
    destroy(canvas: HTMLCanvasElement) {
      if (!canvas.isConnected) {
        // canvas is still rendered, mainly because react in strict mode calls useEffect twice
        creatorState.creator?.destroy()
        creatorState.creator = null
        creatorState.projectId = null
        creatorState.selectedAssetId = null
        creatorState.historySnapshots = []
        creatorState.historySnapshotIndex = 0
        canvas.removeAttribute('data-connected')
        resetAssetStore()
      }
    },
    setInitialAssets(projectId: string, assetUrls: string[]) {
      creatorState.initialAssets = ref({ projectId, assetUrls })
    },
    updateAssetTypoProps(props: TypoProps, commit: boolean) {
      const creator = stateSnapshot.creator
      if (!creator) throw Error('Creator is not initialized')

      creator.updateAssetTypoProps(props, commit)
    },
  }
}

export default useCreator
