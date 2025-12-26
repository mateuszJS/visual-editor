import React, { ToggleEventHandler, useState } from 'react'
import useUniqueId from '@/hooks/useUniqueId/useUniqueId'
import cn from 'classnames'
import styles from './Popover.module.scss'

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  trigger: () => React.ReactNode
  children: React.ReactNode
  popoverClassName?: string
}

export default function Popover({ trigger, children, popoverClassName, ...rest }: Props) {
  const [isShown, setIsShown] = useState(false)
  const popoverId = useUniqueId()

  const toggleIsShown: ToggleEventHandler<HTMLDivElement> = (event) => {
    if (event.target === event.currentTarget) {
      setIsShown(event.newState === 'open')
    }
  }

  return (
    <>
      {/* <div style={{ 'anchor-name': `--${popoverId}-anchor` } as React.CSSProperties}></div> */}

      <button
        popoverTarget={popoverId}
        suppressHydrationWarning
        style={{ 'anchor-name': `--${popoverId}-anchor` } as React.CSSProperties}
        {...rest}
      >
        {trigger()}
      </button>
      <div
        suppressHydrationWarning
        popover="auto"
        id={popoverId}
        onBeforeToggle={toggleIsShown}
        role="dialog"
        aria-modal="true"
        className={cn(styles.popover, popoverClassName)}
        // role="dialog"
        // aria-modal="true"
        style={
          {
            position: 'fixed',
            'anchor-name': `--${popoverId}-body-anchor`,
            'position-anchor': `--${popoverId}-anchor`,
          } as React.CSSProperties
        }
      >
        {isShown ? children : null}
        <div
          className={styles.arrow}
          style={
            {
              alignSelf: 'anchor-center',
              right: `anchor(--${popoverId}-body-anchor right)`,
              top: `clamp(calc(anchor(--${popoverId}-body-anchor top) + var(--arrow-min-offset)), anchor(--${popoverId}-anchor top), calc(anchor(--${popoverId}-body-anchor bottom) - var(--arrow-min-offset)))`,
              bottom: `clamp(calc(anchor(--${popoverId}-body-anchor bottom) + var(--arrow-min-offset)), anchor(--${popoverId}-anchor bottom), calc(anchor(--${popoverId}-body-anchor top) - var(--arrow-min-offset)))`,
            } as React.CSSProperties
          }
        />
      </div>
    </>
  )
}

// https://www.youtube.com/watch?v=DNXEORSk4GU
