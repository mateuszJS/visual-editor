'use client'

import PictureIcon from 'assets/picture-icon.svg'
import NavButton from '@/components/NavButton/NavButton'
import { lazy, Suspense, useState } from 'react'
import useCreator from '@/hooks/useCreator/useCreator'
import Tooltip from '@/components/Tooltip/Tooltip'
import useIsMobile from '@/hooks/useIsMobile/useIsMobile'

const ActionSheets = lazy(() => import('@/components/ActionSheets/ActionSheets'))
const UploadTextures = lazy(() => import('@/components/UploadTextures/UploadTextures'))

const tooltipContent = <span>Upload Image</span>

export default function UploadTexture() {
  const [usUploadShown, setIsUploadShown] = useState(false)
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
      <Suspense fallback={'LoOADINggG'}>
        {/* <Tooltip tooltipContent={tooltipContent}>
        {(props) => ( */}
        <NavButton
          onClick={() => {
            ;(document.activeElement as HTMLElement).blur()
            setIsUploadShown(true)
          }}
        >
          <PictureIcon />
          {isMobile && 'Image'}
        </NavButton>
        {/* )} */}
        {/* </Tooltip> */}
        <div>
          <ActionSheets
            title="Upload image"
            isOpen={usUploadShown}
            close={() => setIsUploadShown(false)}
          >
            <UploadTextures onUpload={addTextures} />
          </ActionSheets>
        </div>
      </Suspense>
    </>
  )
}
