'use client'

import PenToolIcon from 'assets/pen-icon.svg'
import NavButton from '@/components/NavButton/NavButton'
import useCreator from '@/hooks/useCreator/useCreator'
import { CreatorTool } from '@mateuszjs/magic-render'

export default function ShapeTool() {
  const { creator } = useCreator()

  return (
    <>
      <NavButton onClick={() => creator.setTool(CreatorTool.DrawShape)}>
        <PenToolIcon />
        Shape
      </NavButton>
    </>
  )
}
