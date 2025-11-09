'use client'

import useProject from '@/hooks/useProject/useProject'
import initMagicRender, {
  CreatorTool,
  SerializedInputAsset,
  SerializedOutputAsset,
  PointUV,
  ShapeProps,
  SerializedOutputImage,
  SerializedOutputShape,
  SerializedOutputText,
} from '@mateuszjs/magic-render'
import { proxy, ref, useSnapshot } from 'valtio'
import getOnTextureUpload from './getOnTextureUpload'
import uploadMiniature from './uploadMiniature'
import { ApiAsset, ApiProjectAssetsData } from '../../../apiTypes'

type MagicRender = Awaited<ReturnType<typeof initMagicRender>>

interface CreatorStore {
  creator: MagicRender | null
  projectId: string | null
  initialAssets: { projectId: string; assetUrls: string[] } | null
  selectedAssetId: number | null
  historySnapshots: SerializedOutputAsset[][]
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

type SerializedOutputAssetMerged = SerializedOutputImage &
  SerializedOutputShape &
  SerializedOutputText // this type only exist to allow fields removal that might not exist on all variants of the union

function serializeAssets(assets: SerializedOutputAssetMerged[]) {
  return assets.map(
    // due to the nature of TypeScript, we cannot deny properties while doing spread operator
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ({ id, texture_id, cache_texture_id, sdf_texture_id, ...rest }) => rest as unknown as ApiAsset
  )
}

/*
  Hook to be used whenever reference to the creator is needed, like in many Tollbox components.
  Cannot accept any arguments because might be used in a very deep nested component inside creator view.
*/
function useCreator() {
  const stateSnapshot = useSnapshot(creatorState)
  const { updateProject } = useProject()

  const canUndo = stateSnapshot.historySnapshotIndex > 0
  const canRedo = stateSnapshot.historySnapshots.length - 1 > stateSnapshot.historySnapshotIndex

  function setHistoricSnapshot(snapshotIndex: number) {
    creatorState.historySnapshotIndex = snapshotIndex
    const assets = stateSnapshot.historySnapshots[
      creatorState.historySnapshotIndex
    ] as SerializedOutputAssetMerged[]
    creatorState.creator!.resetAssets(assets)

    updateProject(stateSnapshot.projectId!, {
      assets: serializeAssets(assets),
      updatedAt: new Date().toISOString(),
    })
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
    async init(canvas: HTMLCanvasElement, project: ApiProjectAssetsData) {
      if (canvas.hasAttribute('data-connected')) return
      // is already connected to the creator
      // and we assume that canvas is mounted to DOM

      canvas.setAttribute('data-connected', '')

      const creator = await initMagicRender(
        canvas,
        getOnTextureUpload(project.id),
        (assets) => {
          if (creatorState.historySnapshotIndex < creatorState.historySnapshots.length - 1) {
            creatorState.historySnapshots.splice(creatorState.historySnapshotIndex + 1)
          }

          creatorState.historySnapshots.push(ref(assets))
          creatorState.historySnapshotIndex = creatorState.historySnapshots.length - 1

          updateProject(project.id, {
            assets: serializeAssets(assets as SerializedOutputAssetMerged[]),
            updatedAt: new Date().toISOString(),
          })
        },
        (assetId) => {
          creatorState.selectedAssetId = assetId[0] || null
        },
        () => {},
        (canvas) => uploadMiniature(canvas, project.id),
        (tool) => {
          creatorState.tool = tool
        },
        (bounds, props) => {
          assetState.bounds = bounds
          assetState.props = props
        }
      )

      const initialAssets =
        creatorState.initialAssets?.projectId === project.id
          ? creatorState.initialAssets.assetUrls.map((url) => ({ url }))
          : null

      creator.resetAssets(
        (initialAssets || project.assets) as SerializedInputAsset[],
        !!initialAssets // triggers update only when there are initial assets
        // no need to trigger update when project is just opened and no changes were made
      )
      creatorState.initialAssets = null

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
