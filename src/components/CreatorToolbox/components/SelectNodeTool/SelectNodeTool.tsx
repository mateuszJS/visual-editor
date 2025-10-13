'use client'

import NodeSelectIcon from 'assets/node-select-icon.svg'
import NavButton from '@/components/NavButton/NavButton'
import Tooltip from '@/components/Tooltip/Tooltip'
import useCreator from '@/hooks/useCreator/useCreator'
import * as magicRender from '@mateuszjs/magic-render'

const tooltipContent = <span>Select Node</span>

export default function SelectNodeTool() {
  const creatorApi = useCreator()

  return (
    <Tooltip tooltipContent={tooltipContent}>
      {(props) => (
        <NavButton
          {...props}
          onClick={() => creatorApi.creator.setTool(magicRender.CreatorTool.SelectNode)}
        >
          <NodeSelectIcon />
        </NavButton>
      )}
    </Tooltip>
  )
}
