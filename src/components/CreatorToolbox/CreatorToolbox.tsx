'use client'

import RemoveAsset from './components/RemoveAsset/RemoveAsset'
import useCreator from '@/hooks/useCreator/useCreator'
import SelectAssetTool from './components/SelectAssetTool/SelectAssetTool'
import SelectNodeTool from './components/SelectNodeTool/SelectNodeTool'
import UploadTexture from './components/UploadImage/UploadTexture'
import ShapeTool from './components/ShapeTool/ShapeTool'
import TextTool from './components/TextTool/TextTool'
import styles from './CreatorToolbox.module.css'
import cn from 'classnames'
import useIsMobile from '@/hooks/useIsMobile/useIsMobile'
import OverlayLoader from '../OverlayLoader/OverlayLoader'

function getDesktopItems() {
  return (
    <>
      <SelectAssetTool />
      <SelectNodeTool />
      <UploadTexture />
      <ShapeTool />
      <TextTool />
    </>
  )
}

function getMobileItems(selectedAssetId: number | null) {
  if (selectedAssetId) {
    return (
      <>
        <RemoveAsset />
      </>
    )
  }
  return (
    <>
      <UploadTexture />
      <ShapeTool />
      <TextTool />
    </>
  )
}

export default function CreatorToolbox() {
  const { isReady, selectedAssetId } = useCreator()
  const isMobile = useIsMobile()

  return (
    <nav className={cn('navigation-bar', styles.nav)}>
      {isMobile ? getMobileItems(selectedAssetId) : getDesktopItems()}
      <OverlayLoader loading={!isReady} />
    </nav>
  )
}
