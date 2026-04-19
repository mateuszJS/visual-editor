import { useState } from 'react'
import NumberInput from '@/components/NumberInput/NumberInput'
import ActionSheets from '@/components/ActionSheets/ActionSheets'
import Button from '@/components/Button/Button'
import { MAX_PROJECT_SIZE, MIN_PROJECT_SIZE } from '@/consts'

type Props = {
  setSize: (width: number, height: number) => void
}

export default function CustomSizeModal({ setSize }: Props) {
  const [width, setWidth] = useState(1000)
  const [height, setHeight] = useState(1000)

  const onSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSize(width, height)
  }

  return (
    <ActionSheets title="Set custom size" id="custom-size-project-modal">
      <form onSubmit={onSubmit}>
        <div className="flex justify-center w-full">
          <div className="mr-16">
            <NumberInput
              large
              label="Width:"
              unit="px"
              value={width}
              onChange={(v) => setWidth(v)}
              min={MIN_PROJECT_SIZE}
              max={MAX_PROJECT_SIZE}
            />
          </div>
          <div>
            <NumberInput
              large
              label="Height:"
              unit="px"
              value={height}
              onChange={(v) => setHeight(v)}
              min={MIN_PROJECT_SIZE}
              max={MAX_PROJECT_SIZE}
            />
          </div>
        </div>
        <Button type="submit" className="mx-auto mt-16">
          Create Project
        </Button>
      </form>
    </ActionSheets>
  )
}
