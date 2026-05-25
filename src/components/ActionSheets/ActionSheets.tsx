'use client'

import CloseIcon from 'assets/close-icon.svg'
import styles from './ActionSheets.module.css'
import Button from '../Button/Button'
import { useImperativeHandle, useRef } from 'react'
import cn from 'classnames'

interface Props {
  id?: string
  children: React.ReactNode
  title: string
  dialogRef?: React.Ref<{
    open: VoidFunction
    close: VoidFunction
  }>
}

export default function ActionSheets({ id, children, title, dialogRef }: Props) {
  const dialogEl = useRef<HTMLDialogElement>(null)

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

  useImperativeHandle(
    dialogRef,
    () => ({
      open: () => dialogEl.current?.showModal(),
      close: () => dialogEl.current?.close(),
    }),
    []
  )

  return (
    <dialog id={id} className={styles.dialog} onClick={handleClose} ref={dialogEl}>
      <div className={styles.header}>
        <Button
          iconOnly
          variant="ghost"
          className={cn(styles.closeButton, 'cross')}
          onClick={() => dialogEl.current?.close()}
        >
          <CloseIcon />
        </Button>
        <h2 className={styles.title}>{title}</h2>
      </div>
      {children}
    </dialog>
  )
}
