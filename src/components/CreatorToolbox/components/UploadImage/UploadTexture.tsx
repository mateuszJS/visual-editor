'use client'

import PictureIcon from 'assets/picture-icon.svg'
import NavButton from '@/components/NavButton/NavButton'
import { lazy, Suspense } from 'react'
import useCreator from '@/hooks/useCreator/useCreator'
import Tooltip from '@/components/Tooltip/Tooltip'
import useIsMobile from '@/hooks/useIsMobile/useIsMobile'
import { CreatorTool } from '@mateuszjs/magic-render/types'
import posthog from 'posthog-js'
import { MODALS } from '@/consts'

const UploadModal = lazy(() => import('./UploadModal'))

const tooltipContent = <span>Upload Image</span>

export default function UploadTexture() {
  const creatorApi = useCreator()
  const isMobile = useIsMobile()

  function addTextures(textureUrls: string[]) {
    creatorApi.creator.addImages(textureUrls)
    posthog.capture('storage_item_created', { image_count: textureUrls.length })
    document.querySelector<HTMLDialogElement>('#' + MODALS.uploadImageModal)?.close()
  }

  return (
    <>
      <Tooltip tooltipContent={tooltipContent}>
        {(props) => (
          <NavButton
            {...props}
            commandfor={MODALS.uploadImageModal}
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
