// import ColorInput from '@/components/ColorInput/ColorInput'
import type { Program, ProgramInputs, SoftVector4, Vector4 } from '@mateuszjs/magic-render/types'
import styles from './EffectPanel.module.css'
// import cn from 'classnames'
// import useCreator from '@/hooks/useCreator/useCreator'
// import CloseIcon from 'assets/close-icon.svg'

import CodeInput from '@/components/CodeInput/CodeInput'
import { DistanceInput } from '../DistanceInput/DistanceInput'
import { SolidColorInput } from '../SolidColorInput/SolidColorInput'
import { CircleSlider } from '@/components/CircleSlider/CircleSlider'
import cn from 'classnames'
import { ProgramsList } from '@/components/ProgramsList/ProgramsList'
import Popover from '@/components/Popover/Popover'
import { TAU } from '@/consts'
import { Trigger } from '../Trigger/Trigger'
// import GradientInput from '@/components/GradientInput/GradientInput'

interface Props {
  program: Program
  inputs: ProgramInputs['props']
  onChange: (program: Program, inputs: ProgramInputs['props'], commit: boolean) => void
  minDistance: number
  maxDistance: number
}

export default function EffectPanel({
  program,
  inputs,
  onChange,
  minDistance,
  maxDistance,
}: Props) {
  function renderInputControl(inputName: string, value: SoftVector4 | Vector4) {
    const prefix = inputName[0]

    const onChangeInput = (modifiedInput: ProgramInputs['props'][string], commit: boolean) => {
      onChange(program, { [inputName]: modifiedInput }, commit)
    }

    switch (prefix) {
      case 'a':
        return (
          <Popover
            variant="secondary"
            trigger={() => (
              <Trigger name={inputName} type={prefix}>
                A
              </Trigger>
            )}
          >
            <CircleSlider ariaLabel="Angle" value={value} onChange={onChangeInput} />
          </Popover>
        )
      case 't':
        return (
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
        )
      case 'c':
        return <SolidColorInput value={value as Vector4} onChange={onChangeInput} />
      case 'd':
        return (
          <DistanceInput
            value={value}
            onChange={onChangeInput}
            min={minDistance}
            max={maxDistance}
          />
        )
      default:
        throw Error('Unsupproter input prefix name: ' + inputName)
    }
  }

  return (
    <li className={styles.root}>
      {/* <select className={styles.fillType} value={mapFillType(effect.fill)} onChange={onChangeType}>
        <option value="solid">Solid Fill</option>
        <option value="linear">Linear Gradient</option>
        <option value="radial">Radial Gradient</option>
        <option value="program">Custom Program</option>
      </select> */}
      {/* <button onClick={() => onChange(null, true)} className={styles.remove}>
        <CloseIcon />
      </button> */}
      {/* {'solid' in effect.fill && (
        <ColorInput
          aria-label="Fill with solid color"
          value={effect.fill.solid}
          onChange={(color, commit) => onChange({ ...effect, fill: { solid: color } }, commit)}
          className={styles.fill}
        />
      )}
      {'linear' in effect.fill && (
        <GradientInput
          ariaLabel="Fill with linear gradient"
          value={effect.fill.linear}
          onChange={(linear, commit) => onChange({ ...effect, fill: { linear } }, commit)}
          className={styles.fill}
        />
      )}
      {'radial' in effect.fill && (
        <GradientInput
          ariaLabel="Fill with radial gradient"
          value={effect.fill.radial}
          onChange={(radial, commit) => {
            onChange({ ...effect, fill: { radial } }, commit)
          }}
          className={styles.fill}
        />
      )} */}
      <div className="flex">
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
          // popoverClassName={styles.popover}
        >
          <ProgramsList onChange={onChange} initial={{ program, inputs }} />
        </Popover>

        <CodeInput
          value={program.code}
          onChange={(code, commit) => onChange({ ...program, code }, inputs, commit)}
          compilationInfo={
            program
              .compilationInfo?.[0] /* Consider passing all of them, currently we do 1 jsut for simplicity */
          }
        />
      </div>
      <ol className={styles.inputsList}>
        {Object.entries(inputs).map(([name, value]) => (
          <li key={name} className={styles.input}>
            <div className="grow">
              <p className={styles.inputName}>
                <span className={styles.inputAdornment} />
                {name}
              </p>
              {renderInputControl(name, value)}
            </div>
          </li>
        ))}
      </ol>
    </li>
  )
}
