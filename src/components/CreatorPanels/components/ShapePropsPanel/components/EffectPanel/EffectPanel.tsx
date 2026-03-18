import ColorInput from '@/components/ColorInput/ColorInput'
import NumberInput from '@/components/NumberInput/NumberInput'
import type { Fill, Effect } from '@mateuszjs/magic-render/types'
import styles from './EffectPanel.module.css'
import cn from 'classnames'
import useCreator from '@/hooks/useCreator/useCreator'
import CloseIcon from 'assets/close-icon.svg'
import RangeSlider from '@/components/RangeSlider/RangeSlider'
import CodeInput from '@/components/CodeInput/CodeInput'
import GradientInput from '@/components/GradientInput/GradientInput'
import clamp from '@/utils/clamp'

interface Props extends Effect {
  onChange: (changes: Effect | null, commit: boolean) => void
}

function mapFillType(fill: Fill): 'solid' | 'linear' | 'radial' | 'program' {
  if ('solid' in fill) {
    return 'solid'
  }
  if ('linear' in fill) {
    return 'linear'
  }
  if ('radial' in fill) {
    return 'radial'
  }
  if ('program' in fill) {
    return 'program'
  }
  throw Error('Unknown fill type')
}

export default function EffectPanel({ onChange, ...effect }: Props) {
  const { creator } = useCreator()
  const startIsInfinite = creator.INFINITE_DISTANCE_THRESHOLD < effect.dist_start
  const startValue = startIsInfinite ? effect.dist_end + 10 : effect.dist_start

  const onChangeType = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value
    if (value === 'solid') {
      onChange({ ...effect, fill: { solid: [1, 1, 1, 1] } }, true)
    } else if (value === 'linear') {
      onChange(
        {
          ...effect,
          fill: {
            linear: {
              start: { x: 0, y: 0 },
              end: { x: 1, y: 1 },
              stops: [
                { offset: 0, color: [1, 0, 0, 1] },
                { offset: 0.5, color: [0, 1, 0, 1] },
                { offset: 1, color: [0, 0, 1, 1] },
              ],
            },
          },
        },
        true
      )
    } else if (value === 'radial') {
      onChange(
        {
          ...effect,
          fill: {
            radial: {
              start: { x: 0.5, y: 0.5 },
              end: { x: 1, y: 1 },
              stops: [
                { offset: 0, color: [1, 0, 0, 1] },
                { offset: 0.5, color: [0, 1, 0, 1] },
                { offset: 1, color: [0, 0, 1, 1] },
              ],
              radius_ratio: 1,
            },
          },
        },
        true
      )
    } else if (value === 'program') {
      onChange(
        {
          ...effect,
          fill: {
            program: {
              code: `color=vec4f(
  abs(signed_distance*0.01),
  path_t % 1,
  sin(angle / 2),
  1
);`,
            },
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
        <option value="linear">Linear Gradient</option>
        <option value="radial">Radial Gradient</option>
        <option value="program">Custom Program</option>
      </select>
      <button onClick={() => onChange(null, true)} className={styles.remove}>
        <CloseIcon />
      </button>
      {'solid' in effect.fill && (
        <ColorInput
          aria-label="Fill with solid color"
          value={effect.fill.solid}
          onChange={(color, commit) => onChange({ ...effect, fill: { solid: color } }, commit)}
          className={styles.fill}
        />
      )}
      {'linear' in effect.fill && (
        <GradientInput
          aria-label="Fill with linear gradient"
          value={effect.fill.linear}
          onChange={(linear, commit) => onChange({ ...effect, fill: { linear } }, commit)}
          className={styles.fill}
        />
      )}
      {'radial' in effect.fill && (
        <GradientInput
          aria-label="Fill with radial gradient"
          value={effect.fill.radial}
          onChange={(radial, commit) => {
            onChange({ ...effect, fill: { radial } }, commit)
          }}
          className={styles.fill}
        />
      )}
      {'program' in effect.fill && (
        <CodeInput
          value={effect.fill.program.code}
          onChange={(code, commit) => onChange({ ...effect, fill: { program: { code } } }, commit)}
          className={styles.fill}
          error={
            effect.fill.program
              .errors?.[0] /* I don't think it's possible to have more than one compilation error in WGSL */
          }
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
        start={clamp(effect.dist_start, -100, 100)}
        end={clamp(effect.dist_end, -100, 100)}
        onChange={(dist_start, dist_end, commit) =>
          onChange({ ...effect, dist_start, dist_end }, commit)
        }
      />
    </li>
  )
}
