'use client'

import useProject from '@/hooks/useProject/useProject'
import initMagicRender, {
  CreatorTool,
  PointUV,
  ShapeProps,
  ProjectSnapshot,
  SerializedAsset,
} from '@mateuszjs/magic-render'
import { proxy, ref, useSnapshot } from 'valtio'
import getOnTextureUpload from './getOnTextureUpload'
import uploadMiniature from './uploadMiniature'
import { ApiProjectContent } from '../../../apiTypes'
import serializeAssets from './serializeAsset'
import { useRef } from 'react'

type MagicRender = Awaited<ReturnType<typeof initMagicRender>>

interface CreatorStore {
  creator: MagicRender | null
  projectId: string | null
  initialAssets: { projectId: string; assetUrls: string[] } | null
  selectedAssetId: number | null
  historySnapshots: ProjectSnapshot[]
  historySnapshotIndex: number
  tool: CreatorTool
}

// we extract this part to a separate hook since not all components using useCreator need this data
// and this data is going to be updated quite frequently

interface AssetStore {
  bounds: PointUV[] | null
  props: Partial<ShapeProps> | null
}
export const assetState = proxy<AssetStore>({
  bounds: null,
  props: null,
})

const creatorState = proxy<CreatorStore>({
  creator: null,
  projectId: null,
  initialAssets: null,
  selectedAssetId: null,
  historySnapshots: [],
  historySnapshotIndex: 0,
  tool: CreatorTool.SelectAsset,
})

function updateSelectedAssetStore(snapshot?: ProjectSnapshot) {
  const lastSnapshot = snapshot ?? creatorState.historySnapshots[creatorState.historySnapshotIndex]
  const asset = creatorState.selectedAssetId
    ? lastSnapshot.assets.find((a) => a.id === creatorState.selectedAssetId)
    : null

  if (!asset) return

  if (asset.bounds === undefined) throw new Error('Asset bounds are undefined')

  assetState.bounds = asset.bounds

  if ('props' in asset) {
    assetState.props = asset.props
  }
}

/*
  Hook to be used whenever reference to the creator is needed, like in many Tollbox components.
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
    updateSelectedAssetStore()
  }

  return {
    isReady: !!stateSnapshot.creator,
    selectedAssetId: stateSnapshot.selectedAssetId,
    undo: canUndo ? () => setHistoricSnapshot(stateSnapshot.historySnapshotIndex - 1) : null,
    redo: canRedo ? () => setHistoricSnapshot(stateSnapshot.historySnapshotIndex + 1) : null,
    tool: stateSnapshot.tool,
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

      const creator = await initMagicRender(
        project.width,
        project.height,
        canvas,
        getOnTextureUpload(project.id),
        (snapshot, commit) => {
          updateSelectedAssetStore(snapshot)

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
        (assetId) => {
          creatorState.selectedAssetId = assetId[0] || null
          updateSelectedAssetStore()
        },
        () => {},
        (miniCanvas) => uploadMiniature(miniCanvas, project.id),
        (tool) => {
          creatorState.tool = tool
        }
      )

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
          : (project.assets as SerializedAsset[]),
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
      }
    },
    setInitialAssets(projectId: string, assetUrls: string[]) {
      creatorState.initialAssets = ref({ projectId, assetUrls })
    },
  }
}

export default useCreator
