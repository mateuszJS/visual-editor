import cn from 'classnames'
import Slider from '@/components/Slider/Slider'
import styles from './RangeSlider.module.css'

interface Props {
  ariaLabel: string
  start: number
  end: number
  min: number
  max: number
  onChange: (start: number, end: number, commit: boolean) => void
  className?: string
}

export default function RangeSlider({
  ariaLabel,
  min,
  max,
  start,
  end,
  onChange,
  className,
}: Props) {
  const cssVars = {
    '--start': start,
    '--end': end,
    '--min': min,
    '--max': max,
  } as React.CSSProperties

  return (
    <Slider
      ariaLabel={ariaLabel}
      handles={[
        { label: 'Distance at which effect starts', value: start },
        { label: 'Distance at which effect ends', value: end },
      ]}
      min={min}
      max={max}
      onChange={(index, newValue, commit) => {
        if (index === 0) {
          onChange(newValue, Math.min(newValue, end), commit)
        } else {
          onChange(Math.max(start, newValue), newValue, commit)
        }
      }}
      className={cn(styles.slider, className)}
    >
      <>
        <div className={styles.track} />
        <div className={styles.selectedRangeTrack} style={cssVars} />
      </>
    </Slider>
  )
}
