import useUniqueId from '@/hooks/useUniqueId/useUniqueId'
import { ToggleEventHandler, useState } from 'react'

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  trigger: () => React.ReactNode
  children: React.ReactNode
  popoverClassName?: string
}

export default function Popover({ trigger, children, popoverClassName, ...rest }: Props) {
  const [isShown, setIsShown] = useState(false)
  const popoverId = useUniqueId()

  const toggleIsShown: ToggleEventHandler<HTMLDivElement> = (event) => {
    setIsShown(event.newState === 'open')
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
        className={popoverClassName}
        role="dialog"
        aria-modal="true"
        onBeforeToggle={toggleIsShown}
      >
        {isShown ? children : null}
      </div>
    </>
  )
}
