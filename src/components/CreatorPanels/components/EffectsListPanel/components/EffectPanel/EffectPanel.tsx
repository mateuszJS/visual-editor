import type {
  Color,
  ProgramCompilationInfo,
  ProgramInputs,
  SoftVector4,
  Vector4,
} from '@mateuszjs/magic-render/types'
import styles from './EffectPanel.module.scss'
import CodeInput from '@/components/CodeInput/CodeInput'
import { DistanceInput } from '../DistanceInput/DistanceInput'
import { CircleSlider } from '@/components/CircleSlider/CircleSlider'
import cn from 'classnames'
import { ProgramsList } from '@/components/ProgramsList/ProgramsList'
import Popover from '@/components/Popover/Popover'
import { TAU } from '@/consts'
import { Trigger, TriggerType } from '../Trigger/Trigger'
import ColorSelection from '@/components/ColorInput/components/ColorSelection/ColorSelection'
import { fromHex, toHex } from '@/utils/hex'
import DragAndDropIcop from 'assets/drag-n-drop.svg'
import { useSortable } from '@dnd-kit/react/sortable'
import { useRef, useState } from 'react'

interface Props {
  id: number
  index: number
  code: string
  compilationInfo?: ProgramCompilationInfo[] | undefined
  inputs: ProgramInputs['props']
  onChange: (code: string, inputs: ProgramInputs['props'], commit: boolean) => void
  minDistance: number
  maxDistance: number
}

export default function EffectPanel({
  id,
  index,
  code,
  compilationInfo,
  inputs,
  onChange,
  minDistance,
  maxDistance,
}: Props) {
  const [element, setElement] = useState<Element | null>(null)
  const handleRef = useRef<HTMLButtonElement | null>(null)
  const { isDragging } = useSortable({ id, index, element, handle: handleRef })

  function renderInputControl(inputName: string, value: SoftVector4 | Vector4) {
    const prefix = inputName[0] as TriggerType

    const onChangeInput = (modifiedInput: ProgramInputs['props'][string], commit: boolean) => {
      onChange(code, { [inputName]: modifiedInput }, commit)
    }

    switch (prefix) {
      case 'a':
        return (
          <Popover
            variant="ghost"
            className={styles.triggerButton}
            trigger={() => <Trigger name={inputName} type="a" />}
          >
            <CircleSlider ariaLabel="Angle" value={value} onChange={onChangeInput} />
          </Popover>
        )
      case 't':
        return (
          <Popover
            variant="ghost"
            className={styles.triggerButton}
            trigger={() => <Trigger name={inputName} type="t" />}
          >
            <CircleSlider
              showStart
              ariaLabel="Path Progress"
              value={value.map((v) => (v === null ? null : v * TAU)) as SoftVector4}
              onChange={(value, commit) =>
                onChangeInput(
                  value.map((v) => (v === null ? null : ((v + TAU) % TAU) / TAU)) as SoftVector4,
                  commit
                )
              }
            />
          </Popover>
        )
      case 'c':
        return (
          <Popover
            variant="ghost"
            className={styles.triggerButton}
            trigger={() => <Trigger name={inputName} type="c" color={value as Vector4} />}
          >
            <ColorSelection
              initialValue={toHex(value as Color)}
              onChange={(newHex, commit) => onChangeInput(fromHex(newHex), commit)}
            />
          </Popover>
        )
      case 'd':
        return (
          <Popover
            variant="ghost"
            className={styles.triggerButton}
            trigger={() => <Trigger name={inputName} type="d" />}
          >
            <DistanceInput
              value={value}
              onChange={onChangeInput}
              min={minDistance}
              max={maxDistance}
            />
          </Popover>
        )
      default:
        throw Error('Unsupproter input prefix name: ' + inputName)
    }
  }

  return (
    <li className={cn(styles.root, isDragging && styles.dragging)} ref={setElement}>
      <div className={styles.programRow}>
        <Popover
          className={cn(styles.programButton, 'text-ellipsis')}
          trigger={() => (
            <>
              <span className={styles.programName}>Custom</span>
              <span className={styles.caret} aria-hidden="true">
                ▾
              </span>
            </>
          )}
        >
          <ProgramsList onChange={onChange} initial={{ code, inputs }} />
        </Popover>

        <CodeInput
          value={code}
          onChange={(code, commit) => onChange(code, inputs, commit)}
          compilationInfo={
            compilationInfo?.[0] /* Consider passing all of them, currently we do 1 jsut for simplicity */
          }
        />

        <button
          type="button"
          className={styles.dragHandle}
          aria-label="Drag to reorder effect"
          tabIndex={-1}
          ref={handleRef}
        >
          <DragAndDropIcop />
        </button>
      </div>
      <ol className={styles.inputsList}>
        {Object.entries(inputs).map(([name, value]) => (
          <li key={name} className={styles.input}>
            <span className={styles.inputAdornment} aria-hidden="true" />
            {renderInputControl(name, value)}
          </li>
        ))}
      </ol>
    </li>
  )
}
