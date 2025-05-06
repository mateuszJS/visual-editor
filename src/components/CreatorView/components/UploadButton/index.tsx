'use client'

import PictureIcon from 'assets/picture-icon.svg'
import NavButton from '@/components/NavButton'
import { useEffect, useState } from 'react'
import ActionSheets from '@/components/ActionSheets'
import UploadFile from '@/components/UploadFile'
import { FileWithPath } from 'react-dropzone'
import useFetcher from '@/hooks/useFetcher'
import { useParams } from 'next/navigation'

interface Props {
  onUploadImage: (path: string) => void
}

export default function UploadButton({ onUploadImage }: Props) {
  const [usUploadShown, setIsUploadShown] = useState(false)
  const { fetcher, success } = useFetcher<{ path: string }>()
  const params = useParams<{ id: string }>()

  const createProjectFromFiles = async (files: FileWithPath[]) => {
    const formData = new FormData()
    formData.append('file', files[0])
    formData.append('projectId', params.id)

    fetcher('/api/project-assets', {
      method: 'POST',
      formData,
    })
  }

  useEffect(() => {
    if (success) {
      onUploadImage(success.json.path)
      setIsUploadShown(false)
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
