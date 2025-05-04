'use client'

import PictureIcon from 'assets/picture-icon.svg'
import NavButton from '@/components/NavButton'
import { useState } from 'react'
import ActionSheets from '@/components/ActionSheets'
import UploadFile from '@/components/UploadFile'
import { FileWithPath } from 'react-dropzone'

interface Props {
  onUploadImage: (files: FileWithPath[]) => void
}

export default function UploadButton({ onUploadImage }: Props) {
  const [usUploadShown, setIsUploadShown] = useState(false)

  const createProjectFromFiles = async (files: FileWithPath[]) => {
    onUploadImage(files)
    console.log('files', files)
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
        <UploadFile onUpload={createProjectFromFiles} />
      </ActionSheets>
    </>
  )
}
