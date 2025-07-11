'use client'

import TrashIcon from 'assets/trash-bin-icon.svg'
import NavButton from '@/components/NavButton'
import useCreator from '@/hooks/useCreator/useCreator'

export default function RemoveAsset() {
  const { creator } = useCreator()

  return (
    <>
      <NavButton onClick={() => creator.removeAsset()}>
        <TrashIcon />
        Remove
      </NavButton>
    </>
  )
}
