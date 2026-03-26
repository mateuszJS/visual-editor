import ErrorMarkIcon from 'assets/exclamation-mark-icon.svg'
import CloseIcon from 'assets/close-icon.svg'
import styles from './ErrorToast.module.css'
import cn from 'classnames'
import { useState } from 'react'
import Button from '../Button/Button'

interface Props {
  error: string
  close: VoidFunction
}

export default function ErrorToast({ error, close }: Props) {
  const [isExiting, setIsExiting] = useState(false)

  function handleTransitionEnd(e: React.TransitionEvent) {
    if (isExiting && e.propertyName === 'opacity') {
      close()
    }
  }

  return (
    <section
      aria-live="assertive"
      role="alert"
      className={cn(styles.root, { [styles.exiting]: isExiting })}
      onTransitionEnd={handleTransitionEnd}
    >
      <ErrorMarkIcon className={styles.errorIcon} />
      <p>{error}</p>
      <Button
        iconOnly
        onClick={() => setIsExiting(true)}
        aria-label="Close"
        className={styles.closeButton}
        variant="ghost"
      >
        <CloseIcon />
      </Button>
    </section>
  )
}
