import ColorInput from '@/components/ColorInput/ColorInput'
import NumberInput from '@/components/NumberInput/NumberInput'
import { Fill, SdfEffect } from '@mateuszjs/magic-render'
import styles from './Effect.module.css'
import cn from 'classnames'
import useCreator from '@/hooks/useCreator/useCreator'
import CloseIcon from 'assets/close-icon.svg'
import RangeSlider from '@/components/RangeSlider/RangeSlider'
import CodeInput from '@/components/CodeInput/CodeInput'

interface Props extends SdfEffect {
  onChange: (changes: SdfEffect | null, commit: boolean) => void
}

function mapFillType(fill: Fill): 'solid' | 'program' {
  if ('solid' in fill) {
    return 'solid'
  }
  if ('program' in fill) {
    return 'program'
  }
  throw Error('Unknown fill type')
}

export default function Effect({ onChange, ...effect }: Props) {
  const { creator } = useCreator()
  const startIsInfinite = creator.INFINITE_DISTANCE_THRESHOLD < effect.dist_start
  const startValue = startIsInfinite ? effect.dist_end + 10 : effect.dist_start

  const onChangeType = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value
    if (value === 'solid') {
      onChange({ ...effect, fill: { solid: [1, 1, 1, 1] } }, true)
    } else if (value === 'program') {
      onChange(
        {
          ...effect,
          fill: {
            program: { code: 'color=vec4f(abs(signed_distance*0.01),path_t%1,angle/6.24,1);' },
          },
        },
        true
      )
    } else {
      throw Error('Unknown fill type')
    }
  }

  return (
    <li className={styles.root}>
      <select className={styles.fillType} value={mapFillType(effect.fill)} onChange={onChangeType}>
        <option value="solid">Solid Fill</option>
        <option value="program">Custom Program</option>
      </select>
      <button onClick={() => onChange(null, true)} className={styles.remove}>
        <CloseIcon />
      </button>
      {'solid' in effect.fill && (
        <ColorInput
          label="Fill"
          value={effect.fill.solid}
          onChange={(color, commit) => onChange({ ...effect, fill: { solid: color } }, commit)}
          className={styles.fill}
        />
      )}
      {'program' in effect.fill && (
        <CodeInput
          value={effect.fill.program.code}
          onChange={(code, commit) => onChange({ ...effect, fill: { program: { code } } }, commit)}
          className={styles.fill}
          errors={effect.fill.program.errors}
        />
      )}
      <NumberInput
        label="From:"
        value={startValue}
        onChange={(dist_start, commit) => onChange({ ...effect, dist_start }, commit)}
        unit="px"
        className={cn({ [styles.grayout]: startIsInfinite })}
        onFocus={
          startIsInfinite ? () => onChange({ ...effect, dist_start: startValue }, true) : undefined
        }
      />
      <button
        aria-label="Set starting point to infinite big number"
        className={cn(styles.infinity, {
          [styles.grayout]: !startIsInfinite,
        })}
        onClick={() => onChange({ ...effect, dist_start: creator.INFINITE_DISTANCE }, true)}
      >
        ∞
      </button>
      <NumberInput
        label="To:"
        value={effect.dist_end}
        onChange={(dist_end, commit) => onChange({ ...effect, dist_end }, commit)}
        unit="px"
      />
      <RangeSlider
        ariaLabel="Update effect range"
        className={styles.range}
        min={-100}
        max={100}
        start={Math.min(effect.dist_start, 100)}
        end={Math.max(effect.dist_end, -100)}
        onChange={(dist_start, dist_end, commit) =>
          onChange({ ...effect, dist_start, dist_end }, commit)
        }
      />
    </li>
  )
}
