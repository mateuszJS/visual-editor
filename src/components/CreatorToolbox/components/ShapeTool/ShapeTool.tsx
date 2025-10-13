'use client'

import PenToolIcon from 'assets/pen-icon.svg'
import NavButton from '@/components/NavButton/NavButton'
import useCreator from '@/hooks/useCreator/useCreator'
import { CreatorTool } from '@mateuszjs/magic-render'
import Tooltip from '@/components/Tooltip/Tooltip'
import useIsMobile from '@/hooks/useIsMobile/useIsMobile'

const tooltipContent = <span>Draw Shape</span>

export default function ShapeTool() {
  const creatorApi = useCreator()
  const isMobile = useIsMobile()

  return (
    <Tooltip tooltipContent={tooltipContent}>
      {(props) => (
        <NavButton
          {...props}
          onClick={() => creatorApi.creator.setTool(CreatorTool.DrawBezierCurve)}
          aria-pressed={creatorApi.tool === CreatorTool.DrawBezierCurve}
        >
          <PenToolIcon />
          {isMobile && 'Shape'}
        </NavButton>
      )}
    </Tooltip>
  )
}
