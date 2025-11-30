import { ToggleEventHandler, useState } from 'react'
import useUniqueId from '@/hooks/useUniqueId/useUniqueId'
import cn from 'classnames'
import styles from './Popover.module.css'

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
      <button popoverTarget={popoverId} suppressHydrationWarning {...rest}>
        {trigger()}
      </button>
      <div
        id={popoverId}
        suppressHydrationWarning
        popover="auto"
        className={cn(styles.popover, popoverClassName)}
        role="dialog"
        aria-modal="true"
        onBeforeToggle={toggleIsShown}
      >
        {isShown ? children : null}
      </div>
    </>
  )
}
