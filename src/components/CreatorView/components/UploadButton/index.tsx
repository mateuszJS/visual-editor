'use client'

import PictureIcon from 'assets/picture-icon.svg'
import NavButton from '@/components/NavButton'
import { useEffect, useState } from 'react'
import ActionSheets from '@/components/ActionSheets'
import UploadFile from '@/components/UploadFile'
import { FileWithPath } from 'react-dropzone'
import useFetcher from '@/hooks/useFetcher'
import useCreator from '@/components/CreatorView/useCreator'

export default function UploadButton() {
  const [usUploadShown, setIsUploadShown] = useState(false)
  const { fetcher, success } = useFetcher<{ path: string }>()
  const { projectId, creator } = useCreator()

  const createProjectFromFiles = async (files: FileWithPath[]) => {
    const formData = new FormData()
    formData.append('file', files[0])
    formData.append('projectId', projectId.toString())

    fetcher('/api/project-assets', {
      method: 'POST',
      formData,
    })
  }

  useEffect(() => {
    if (success) {
      const img = new Image()

      img.src = `/api/project-assets?path=${encodeURIComponent(success.json.path)}`
      img.onload = function () {
        creator.addImage(img)
        setIsUploadShown(false)
      }
    }
  }, [success])

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
