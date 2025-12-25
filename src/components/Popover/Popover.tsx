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
        popover="auto"
        id={popoverId}
        onBeforeToggle={toggleIsShown}
        role="dialog"
        aria-modal="true"
        className={styles.connector}
      />
      <div
        suppressHydrationWarning
        className={cn(styles.popover, popoverClassName)}
        role="dialog"
        aria-modal="true"
        style={
          {
            position: 'fixed',
            'anchor-name': `--${popoverId}-body-anchor`,
            'position-anchor': `--${popoverId}-anchor`,
          } as React.CSSProperties
        }
      >
        <div />

        <div className={styles.popoverContent}>{isShown ? children : null}</div>
      </div>
      {/* <div> */}
      <div
        className={styles.arrow}
        style={
          {
            position: 'fixed',
            // 'position-anchor': `--${popoverId}-anchor`,

            // top: `anchor(--${popoverId}-anchor top)`,
            top: `anchor(--${popoverId}-anchor center)`,
            right: `anchor(--${popoverId}-body-anchor right)`,
            // right: `anchor(--${popoverId}-anchor left)`,

            // left: 'anchor(--one right)',
            // bottom: 'anchor(--two top)',

            background: 'lime',
          } as React.CSSProperties
        }
      />
      {/* </div> */}
    </>
  )
}

// https://www.youtube.com/watch?v=DNXEORSk4GU
