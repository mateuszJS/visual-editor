'use client'

import PictureIcon from 'assets/picture-icon.svg'
import NavButton from '@/components/NavButton'
import { useState } from 'react'
import ActionSheets from '@/components/ActionSheets'
import UploadAssets from '@/components/UploadAssets'
import useCreator from '@/components/CreatorView/useCreator/useCreator'

export default function UploadButton() {
  const [usUploadShown, setIsUploadShown] = useState(false)
  const { creator } = useCreator()

  function createProjectFromAssets(assetIds: string[]) {
    assetIds.forEach((id) => {
      const img = new Image()
      img.src = `/api/project-assets/${id}`
      img.onload = function () {
        creator.addImage(img)
        setIsUploadShown(false)
      }
    })
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
        <UploadAssets onUpload={createProjectFromAssets} />
      </ActionSheets>
    </>
  )
}
