'use client'

import PictureIcon from 'assets/picture-icon.svg'
import NavButton from '@/components/NavButton/NavButton'
import { lazy, Suspense, useState } from 'react'
import useCreator from '@/hooks/useCreator/useCreator'
import Tooltip from '@/components/Tooltip/Tooltip'
import useIsMobile from '@/hooks/useIsMobile/useIsMobile'

const UploadModal = lazy(() => import('./UploadModal'))

const tooltipContent = <span>Upload Image</span>

export default function UploadTexture() {
  const [isUploadShown, setIsUploadShown] = useState(false)
  const creatorApi = useCreator()
  const isMobile = useIsMobile()

  async function addTextures(textureUrls: string[]) {
    textureUrls.forEach((url) => {
      creatorApi.creator.addImage(url)
    })

    setIsUploadShown(false)
  }

  return (
    <>
      <Tooltip tooltipContent={tooltipContent}>
        {(props) => (
          <NavButton
            {...props}
            onClick={() => {
              ;(document.activeElement as HTMLElement).blur()
              setIsUploadShown(true)
            }}
          >
            <PictureIcon />
            {isMobile && 'Image'}
          </NavButton>
        )}
      </Tooltip>
      <Suspense>
        <UploadModal
          isOpen={isUploadShown}
          close={() => setIsUploadShown(false)}
          onUpload={addTextures}
        />
      </Suspense>
    </>
  )
}
