'use client'

import Modal from 'react-modal'
import CloseIcon from 'assets/close-icon.svg'
import styles from './styles.module.css'
import classNamesOverlay from '@/components/shared/overlayStyles'
import IconButton from '@/components/IconButton'

if (process.env.NODE_ENV === 'test') {
  const testElement = document.createElement('div')
  testElement.id = 'non-modal-content'
  document.body.append(testElement)
  Modal.setAppElement(testElement)
} else {
  Modal.setAppElement('#non-modal-content')
}

interface Props {
  isOpen: boolean
  close: VoidFunction
  children: React.ReactNode
  title: string
}

const classNames = {
  base: styles.base,
  afterOpen: styles.open,
  beforeClose: styles.closed,
}

const TRANSITION_TIME_MS = 300

const style = {
  overlay: { '--transition-time': `${TRANSITION_TIME_MS}ms` } as React.CSSProperties,
}

export default function ActionSheets({ isOpen, close, children, title }: Props) {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={close}
      className={classNames}
      contentLabel={title}
      overlayClassName={classNamesOverlay}
      closeTimeoutMS={TRANSITION_TIME_MS}
      style={style}
    >
      <div className={styles.header}>
        <IconButton onClick={close} className={styles.closeButton}>
          <CloseIcon />
        </IconButton>
        <h2 className={styles.title}>{title}</h2>
      </div>
      {children}
    </Modal>
  )
}
