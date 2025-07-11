'use client'

import PictureIcon from 'assets/picture-icon.svg'
import NavButton from '@/components/NavButton'
import { useState } from 'react'
import ActionSheets from '@/components/ActionSheets'
import UploadAssets from '@/components/UploadAssets'
import useCreator from '@/hooks/useCreator/useCreator'
import loadImagesFromAssetIds from '@/utils/loadImagesFromAssetIds'

export default function UploadAsset() {
  const [usUploadShown, setIsUploadShown] = useState(false)
  const { creator } = useCreator()

  async function addAssetsToProject(assetIds: string[]) {
    const images = await loadImagesFromAssetIds(assetIds)

    images.forEach((img) => {
      creator.addImage(img)
    })

    setIsUploadShown(false)
  }

  return (
    <>
      <NavButton onClick={() => setIsUploadShown(true)}>
        <PictureIcon />
        Image
      </NavButton>
      <ActionSheets
        title="Upload image"
        isOpen={usUploadShown}
        close={() => setIsUploadShown(false)}
      >
        <UploadAssets onUpload={addAssetsToProject} />
      </ActionSheets>
    </>
  )
}
