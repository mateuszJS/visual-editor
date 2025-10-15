'use client'

import ObjectSelectIcon from 'assets/object-select-icon.svg'
import NavButton from '@/components/NavButton/NavButton'
import Tooltip from '@/components/Tooltip/Tooltip'
import useCreator from '@/hooks/useCreator/useCreator'
import { CreatorTool } from '@mateuszjs/magic-render'

const tooltipContent = <span>Select Object</span>

export default function SelectAssetTool() {
  const creatorApi = useCreator()

  return (
    <Tooltip tooltipContent={tooltipContent}>
      {(props) => (
        <NavButton
          {...props}
          onClick={() => creatorApi.creator.setTool(CreatorTool.SelectAsset)}
          aria-pressed={creatorApi.tool === CreatorTool.SelectAsset}
        >
          <ObjectSelectIcon />
        </NavButton>
      )}
    </Tooltip>
  )
}
