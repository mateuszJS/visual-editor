import cn from 'classnames'
import { GradientStop } from '@mateuszjs/magic-render/types'
import { toHex } from '@/utils/hex'
import Slider from '@/components/Slider/Slider'
import styles from './GradientSlider.module.css'

interface Props {
  stops: GradientStop[]
  onChange: (stops: GradientStop[], commit: boolean) => void
  onSelectStop: (stopIndex: number) => void
  className?: string
}

export default function GradientSlider({ stops, onChange, onSelectStop, className }: Props) {
  const handles = stops.map((stop, index) => ({
    label: `Gradient stop number ${index + 1}`,
    value: stop.offset,
    color: toHex(stop.color),
  }))

  return (
    <Slider
      ariaLabel="Gradient components"
      handles={handles}
      min={0}
      max={1}
      onChange={(index, newValue, commit) => {
        const newStops = [...stops]
        newStops[index] = { ...newStops[index], offset: newValue }
        onChange(newStops, commit)
      }}
      className={cn(styles.slider, className)}
      onFocusHandler={onSelectStop}
    >
      <div
        className={styles.gradientTrack}
        style={{
          background: `linear-gradient(to right, ${stops
            .toSorted((a, b) => a.offset - b.offset)
            .map((stop) => toHex(stop.color) + ' ' + stop.offset * 100 + '%')
            .join(', ')})`,
        }}
      />
    </Slider>
  )
}
