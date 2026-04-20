'use client'

import CloseIcon from 'assets/close-icon.svg'
import styles from './ActionSheets.module.css'
import Button from '../Button/Button'

interface Props {
  id: string
  children: React.ReactNode
  title: string
}

export default function ActionSheets({ id, children, title }: Props) {
  const handleClose = (e: React.MouseEvent<HTMLDialogElement>) => {
    // iOS does NOT support closing modal via click on backdrop currently.
    const dialogDimensions = e.currentTarget.getBoundingClientRect()
    if (
      e.clientX < dialogDimensions.left ||
      e.clientX > dialogDimensions.right ||
      e.clientY < dialogDimensions.top ||
      e.clientY > dialogDimensions.bottom
    ) {
      e.currentTarget.close()
      e.stopPropagation()
    }
  }

  return (
    <dialog id={id} className={styles.dialog} onClick={handleClose}>
      <div className={styles.header}>
        <Button
          iconOnly
          variant="ghost"
          className={styles.closeButton}
          commandfor={id}
          command="close"
        >
          <CloseIcon />
        </Button>
        <h2 className={styles.title}>{title}</h2>
      </div>
      {children}
    </dialog>
  )
}
