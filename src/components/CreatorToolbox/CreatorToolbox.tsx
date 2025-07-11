'use client'

import UploadAsset from './components/UploadAsset/UploadAsset'
import RemoveAsset from './components/RemoveAsset/RemoveAsset'
import useCreator from '@/hooks/useCreator/useCreator'

export default function Toolbox() {
  const { isReady, selectedAssetId } = useCreator()

  if (!isReady) {
    return <nav className="navigation-bar">Loading</nav>
  }

  return (
    <nav className="navigation-bar">
      {selectedAssetId === null ? (
        <>
          <UploadAsset />
        </>
      ) : (
        <>
          <RemoveAsset />
        </>
      )}
    </nav>
  )
}
