import { ToggleEventHandler, useState } from 'react'
import useUniqueId from '@/hooks/useUniqueId/useUniqueId'
import cn from 'classnames'
import styles from './Popover.module.css'
import Button from '../Button/Button'

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
      <Button
        variant="ghost"
        {...rest}
        iconOnly
        popoverTarget={popoverId}
        style={{ 'anchor-name': `--${popoverId}-anchor` } as React.CSSProperties}
      >
        {trigger()}
      </Button>
      <div
        id={popoverId}
        suppressHydrationWarning
        popover="auto"
        className={cn(styles.popover, popoverClassName)}
        role="dialog"
        aria-modal="true"
        onBeforeToggle={toggleIsShown}
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
