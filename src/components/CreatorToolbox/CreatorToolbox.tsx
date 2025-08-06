'use client'

import UploadTexture from './components/UploadTexture/UploadTexture'
import RemoveAsset from './components/RemoveAsset/RemoveAsset'
import useCreator from '@/hooks/useCreator/useCreator'
import ShapeTool from './components/ShapeTool/ShapeTool'
import TextTool from './components/TextTool/TextTool'

export default function Toolbox() {
  const { isReady, selectedAssetId } = useCreator()

  if (!isReady) {
    return <nav className="navigation-bar">Loading</nav>
  }

  return (
    <nav className="navigation-bar">
      {selectedAssetId === null ? (
        <>
          <UploadTexture />
          <ShapeTool />
          <TextTool />
        </>
      ) : (
        <>
          <RemoveAsset />
        </>
      )}
    </nav>
  )
}
