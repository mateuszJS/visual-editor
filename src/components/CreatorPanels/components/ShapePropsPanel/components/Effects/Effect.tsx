import ColorInput from '@/components/ColorInput/ColorInput'
import NumberInput from '@/components/NumberInput/NumberInput'
import { SdfEffect } from '@mateuszjs/magic-render'
import styles from './Effect.module.css'
import cn from 'classnames'
import useCreator from '@/hooks/useCreator/useCreator'
import CloseIcon from 'assets/close-icon.svg'
import RangeSlider from '@/components/RangeSlider/RangeSlider'

interface Props extends SdfEffect {
  onChange: (changes: SdfEffect | null, commit: boolean) => void
}

export default function Effect({ onChange, ...effect }: Props) {
  const { creator } = useCreator()
  const startIsInfinite = creator.INFINITE_DISTANCE_THRESHOLD < effect.dist_start
  const startValue = startIsInfinite ? effect.dist_end + 10 : effect.dist_start

  return (
    <li className={styles.root}>
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
        start={effect.dist_start}
        end={effect.dist_end}
        onChange={(dist_start, dist_end, commit) =>
          onChange({ ...effect, dist_start, dist_end }, commit)
        }
      />
    </li>
  )
}
