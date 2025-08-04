'use client'

import PictureIcon from 'assets/picture-icon.svg'
import NavButton from '@/components/NavButton/NavButton'
import { useState } from 'react'
import ActionSheets from '@/components/ActionSheets/ActionSheets'
import UploadTextures from '@/components/UploadTextures/UploadTextures'
import useCreator from '@/hooks/useCreator/useCreator'

export default function UploadAsset() {
  const [usUploadShown, setIsUploadShown] = useState(false)
  const { creator } = useCreator()

  async function addTextures(textureUrls: string[]) {
    textureUrls.forEach((url) => {
      creator.addImage(url)
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
        <UploadTextures onUpload={addTextures} />
      </ActionSheets>
    </>
  )
}
