'use client'

import PictureIcon from 'assets/picture-icon.svg'
import NavButton from '@/components/NavButton/NavButton'
import { lazy, Suspense } from 'react'
import useCreator from '@/hooks/useCreator/useCreator'
import Tooltip from '@/components/Tooltip/Tooltip'
import useIsMobile from '@/hooks/useIsMobile/useIsMobile'
import { CreatorTool } from '@mateuszjs/magic-render/types'

const UploadModal = lazy(() => import('./UploadModal'))

const tooltipContent = <span>Upload Image</span>

export default function UploadTexture() {
  const creatorApi = useCreator()
  const isMobile = useIsMobile()

  function addTextures(textureUrls: string[]) {
    creatorApi.creator.addImages(textureUrls)
    document.querySelector<HTMLDialogElement>('#upload-image-modal')?.close()
  }

  return (
    <>
      <Tooltip tooltipContent={tooltipContent}>
        {(props) => (
          <NavButton
            {...props}
            commandfor="upload-image-modal"
            command="show-modal"
            onClick={() => {
              creatorApi.creator.setTool(CreatorTool.SelectAsset)
            }}
          >
            <PictureIcon />
            {isMobile && 'Image'}
          </NavButton>
        )}
      </Tooltip>
      <Suspense>
        <UploadModal onUpload={addTextures} />
      </Suspense>
    </>
  )
}
