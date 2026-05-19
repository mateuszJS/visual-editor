import NumberInput from '@/components/NumberInput/NumberInput'
import RangeSlider from '@/components/RangeSlider/RangeSlider'
import clamp from '@/utils/clamp'
import styles from './DistanceInput.module.css'
import SoftRangeSlider from '@/components/SoftRangeSlider/SoftRangeSlider'
import { SoftVector4 } from '@mateuszjs/magic-render/types'

interface Props {
  value: SoftVector4
  onChange: (newValue: SoftVector4, commit: boolean) => void
  min: number
  max: number
}

export function DistanceInput({ value, onChange, min, max }: Props) {
  return (
    <div>
      {/* <NumberInput
        label="From:"
        value={value[1]}
        onChange={(newValue, commit) => onChange([newValue, newValue, value[2], value[3]], commit)}
        unit="px"
        // className={cn({ [styles.grayout]: startIsInfinite })}
        // onFocus={
        //   startIsInfinite
        //     ? () => onChange({ ...effect, dist_start: startValue }, true)
        //     : undefined
        // }
      /> */}
      {/* <button
            aria-label="Set starting point to infinite big number"
            className={cn(styles.infinity, {
              [styles.grayout]: !startIsInfinite,
            })}
            onClick={() => onChange({ ...effect, dist_start: creator.INFINITE_DISTANCE }, true)}
          >
            ∞
          </button> */}
      {/* <NumberInput
        label="From:"
        value={value[2]}
        onChange={(newValue, commit) => onChange([value[0], value[1], newValue, newValue], commit)}
        unit="px"
        // className={cn({ [styles.grayout]: startIsInfinite })}
        // onFocus={
        //   startIsInfinite
        //     ? () => onChange({ ...effect, dist_start: startValue }, true)
        //     : undefined
        // }
      /> */}
      <SoftRangeSlider
        ariaLabel="Update effect range"
        className={styles.range}
        min={min}
        max={max}
        value={value}
        onChange={onChange}
      />
    </div>
  )
}
