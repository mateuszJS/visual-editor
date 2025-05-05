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
  onUploadImage: (files: FileWithPath[]) => void
}

export default function UploadButton({ onUploadImage }: Props) {
  const [usUploadShown, setIsUploadShown] = useState(false)
  const { fetcher, success } = useFetcher()
  const params = useParams<{ id: string }>()

  const createProjectFromFiles = async (files: FileWithPath[]) => {
    const formData = new FormData()
    formData.append('file', files[0])

    fetcher(`/api/project-assets/${params.id}`, {
      method: 'POST',
      formData,
    })

    onUploadImage(files)
    console.log('files', files)
  }

  useEffect(() => {
    if (success) {
      console.log('success', success)
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
