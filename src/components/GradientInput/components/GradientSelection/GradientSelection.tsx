import styles from './GradientSelection.module.css'
import GradientSlider from '../GradientSlider/GradientSlider'
import NumberInput from '@/components/NumberInput/NumberInput'
import { useState } from 'react'
import ColorInput from '@/components/ColorInput/ColorInput'
import { getLinearEndpoints, getRadialEndPoint } from './utils'
import { Gradient } from '../../types'

interface Props<T extends Gradient> {
  value: T
  onChange: (newValue: T, commit: boolean) => void
}

export default function GradientSelection<T extends Gradient>({ value, onChange }: Props<T>) {
  const [selectedStopIndex, setSelectedStopIndex] = useState<number | null>(null)

  const selectedStop = selectedStopIndex !== null ? value.stops[selectedStopIndex] : null

  return (
    <div className={styles.root}>
      <GradientSlider
        className={styles.slider}
        stops={value.stops}
        onChange={(stops, commit) => {
          onChange({ ...value, stops }, commit)
        }}
        onSelectStop={setSelectedStopIndex}
      />
      <div className={styles.columnsSplit}>
        <div>
          <fieldset className={styles.start}>
            <legend>Start</legend>
            <NumberInput
              label="X:"
              value={value.start.x * 100}
              unit="%"
              onChange={(newX, commit) => {
                onChange({ ...value, start: { ...value.start, x: newX / 100 } }, commit)
              }}
            />
            <NumberInput
              label="Y:"
              value={value.start.y * 100}
              unit="%"
              onChange={(newY, commit) => {
                onChange({ ...value, start: { ...value.start, y: newY / 100 } }, commit)
              }}
            />
          </fieldset>
          <fieldset className={styles.end}>
            <legend>End</legend>
            <NumberInput
              label="X:"
              value={value.end.x * 100}
              unit="%"
              onChange={(newX, commit) => {
                onChange({ ...value, end: { ...value.end, x: newX / 100 } }, commit)
              }}
            />
            <NumberInput
              label="Y:"
              value={value.end.y * 100}
              unit="%"
              onChange={(newY, commit) => {
                onChange({ ...value, end: { ...value.end, y: newY / 100 } }, commit)
              }}
            />
          </fieldset>
          <NumberInput
            label="Angle:"
            value={
              (Math.atan2(value.start.y - value.end.y, value.start.x - value.end.x) * 180) / Math.PI
            }
            unit="deg"
            onChange={(angleDegrees, commit) => {
              const endpoints =
                'radius_ratio' in value
                  ? { end: getRadialEndPoint(angleDegrees, value) }
                  : getLinearEndpoints(angleDegrees, value)
              onChange({ ...value, ...endpoints }, commit)
            }}
          />
          {'radius_ratio' in value && (
            <NumberInput
              label="Aspect Ratio:"
              value={value.radius_ratio * 100}
              unit="%"
              onChange={(newAspectRatio, commit) => {
                onChange({ ...value, radius_ratio: newAspectRatio / 100 }, commit)
              }}
            />
          )}
        </div>

        {selectedStop && (
          <div>
            <div className={styles.stopDetails}>
              <ColorInput
                label="Stop color:"
                value={selectedStop.color}
                onChange={(newColor, commit) => {
                  const newStops = value.stops.map((stop, index) =>
                    index === selectedStopIndex ? { ...stop, color: newColor } : stop
                  )
                  onChange({ ...value, stops: newStops }, commit)
                }}
                className={styles.colorInput}
              />
              <NumberInput
                label="Position:"
                value={selectedStop.offset * 100}
                unit="%"
                onChange={(newOffset, commit) => {
                  const newStops = value.stops.map((stop, index) =>
                    index === selectedStopIndex ? { ...stop, offset: newOffset / 100 } : stop
                  )
                  onChange({ ...value, stops: newStops }, commit)
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
