'use client'

import TextIcon from 'assets/text-icon.svg'
import NavButton from '@/components/NavButton/NavButton'
import Tooltip from '@/components/Tooltip/Tooltip'
import { CreatorTool } from '@mateuszjs/magic-render'
import useCreator from '@/hooks/useCreator/useCreator'
import useIsMobile from '@/hooks/useIsMobile/useIsMobile'

const tooltipContent = <span>Add Text</span>

export default function TextTool() {
  const creatorApi = useCreator()
  const isMobile = useIsMobile()

  return (
    <Tooltip tooltipContent={tooltipContent}>
      {(props) => (
        <NavButton {...props} onClick={() => creatorApi.creator.setTool(CreatorTool.Text)}>
          <TextIcon />
          {isMobile && 'Text'}
        </NavButton>
      )}
    </Tooltip>
  )
}
