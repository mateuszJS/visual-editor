import { Component, createRef } from 'react'
import styles from './CircleSlider.module.scss'
import { SoftVector4 } from '@mateuszjs/magic-render/types'
import { softVecToHandles } from '../CreatorPanels/components/ShapePropsPanel/components/utils'
import { getConicGradient } from './getConicGradient'
import { sanitizeOnChange } from './sanitizeChange'
import { TAU } from '@/consts'

export interface Handle {
  label: string
  value: number
  color?: string
}

interface Props {
  ariaLabel: string
  value: SoftVector4
  showStart?: boolean
  onChange: (newValue: SoftVector4, commit: boolean) => void
  onFocusHandler?: (index: number) => void
}

/**
 * Multi-handle circular range input — lets the user pick one or more angles
 * (in degrees) by dragging handles around a circular track.
 *
 * 0° points up (12 o'clock) and the value increases clockwise, which matches
 * how CSS / canvas typically express angles. Values always wrap in [0, 360).
 *
 * Drag lifecycle for each handle:
 * - mousedown on the button → start listening to window `mousemove`/`mouseup`
 * - mouseup anywhere        → stop listening and commit the final value
 */

export class CircleSlider extends Component<Props> {
  circleRef = createRef<HTMLDivElement>()
  abortRef = createRef<AbortController>()

  state = {
    gearStartAngle: 0,
    gearCssRotation: '0deg',
  }

  angleFromPointer = (clientX: number, clientY: number) => {
    const el = this.circleRef.current
    if (!el) return 0
    const rect = el.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    // atan2 is measured from the +x axis; +90° rotates so 0° points up.
    const deg = Math.atan2(cy - clientY, clientX - cx)
    return ((deg % TAU) + TAU) % TAU
  }

  onMouseMove = (event: MouseEvent, index: number, isMouseUp: boolean) => {
    if (isMouseUp) {
      this.abortRef.current?.abort()
      this.abortRef.current = null
    }
    // Again, same issue as Before, "value" is stale, from previous render
    const newComponent = this.angleFromPointer(event.clientX, event.clientY)
    const newValue = sanitizeOnChange(this.props.value, index, newComponent)
    console.log('onMouseMove', newValue)
    this.props.onChange(newValue, isMouseUp)
  }

  onMouseDownKnob = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, index: number) => {
    if (e.button !== 0) return

    this.abortRef.current?.abort()
    const ac = new AbortController()
    this.abortRef.current = ac

    window.addEventListener(
      'mousemove',
      (event) => {
        this.onMouseMove(event, index, false)
      },
      { signal: ac.signal }
    )

    window.addEventListener(
      'mouseup',
      (event) => {
        this.onMouseMove(event, index, true)
      },
      { signal: ac.signal }
    )

    this.props.onFocusHandler?.(index)
  }

  onUpdateGear = (e: MouseEvent, valueSnapshot: SoftVector4, commit: boolean) => {
    const currAngle = this.angleFromPointer(e.clientX, e.clientY)
    const angleDiff = currAngle - this.state.gearStartAngle
    this.props.onChange(
      valueSnapshot.map((v) => (v === null ? null : v + angleDiff)) as SoftVector4,
      commit
    )
    this.setState({
      gearCssRotation: (-1 * (angleDiff * 180)) / Math.PI + 'deg',
    })
  }

  onMouseDownGear = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (e.button !== 0) return

    this.setState({ gearStartAngle: this.angleFromPointer(e.clientX, e.clientY) })

    this.abortRef.current?.abort()
    const ac = new AbortController()
    this.abortRef.current = ac

    const valueSnapshot = [...this.props.value] as SoftVector4

    window.addEventListener(
      'mousemove',
      (event) => {
        this.onUpdateGear(event, valueSnapshot, false)
      },
      { signal: ac.signal }
    )

    window.addEventListener(
      'mouseup',
      (event) => {
        this.abortRef.current?.abort()
        this.abortRef.current = null
        this.onUpdateGear(event, valueSnapshot, true)
      },
      { signal: ac.signal }
    )
  }

  render() {
    const { value, ariaLabel, showStart } = this.props

    const y = value[1] === null ? value[2] : value[1]
    const z = value[2] === null ? value[1] : value[2]
    if (z == null || y == null) {
      throw Error(`in soft vec 4 y and z are null at once. ${value}`)
    }

    console.log(value)

    const handles = softVecToHandles(value)

    return (
      <div
        ref={this.circleRef}
        className={styles.circle}
        role="group"
        aria-label={ariaLabel}
        style={{
          background: getConicGradient([
            value[0] === null ? y : value[0],
            y,
            z,
            value[3] === null ? z : value[3],
          ]),
        }}
      >
        <button
          className={styles.gear}
          style={{ rotate: this.state.gearCssRotation }}
          onMouseDown={(e) => this.onMouseDownGear(e)}
        ></button>
        {showStart && (
          <div className={styles.startAngle}>
            <div>Start</div>
            <div>End</div>
          </div>
        )}
        {handles.map((handle, index) =>
          handle === null ? null : (
            <div
              key={index}
              className={styles.arm}
              style={
                { '--rotate': -(handle.value * 180) / Math.PI + 90 + 'deg' } as React.CSSProperties
              }
            >
              <button
                className={styles.handle}
                onMouseDown={(e) => this.onMouseDownKnob(e, index)}
                aria-label={handle.label}
                {...{ [`data-knob-${handle.knobType}`]: true }}
              />
              <button className={styles.removeBtn}></button>
            </div>
          )
        )}
      </div>
    )
  }
}
