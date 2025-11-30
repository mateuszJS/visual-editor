'use client'

import NodeSelectIcon from 'assets/node-select-icon.svg'
import NavButton from '@/components/NavButton/NavButton'
import Tooltip from '@/components/Tooltip/Tooltip'
import useCreator from '@/hooks/useCreator/useCreator'
import { CreatorTool } from '@mateuszjs/magic-render/types'

const tooltipContent = <span>Select Node</span>

export default function SelectNodeTool() {
  const creatorApi = useCreator()

  return (
    <Tooltip tooltipContent={tooltipContent}>
      {(props) => (
        <NavButton
          {...props}
          onClick={() => creatorApi.creator.setTool(CreatorTool.SelectNode)}
          aria-pressed={creatorApi.tool === CreatorTool.SelectNode}
        >
          <NodeSelectIcon />
        </NavButton>
      )}
    </Tooltip>
  )
}
