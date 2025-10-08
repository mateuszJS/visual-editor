'use client'

import Modal from 'react-modal'
import styles from './OverlayLoader.module.css'
import classNamesOverlay from '@/components/shared/overlayStyles'

if (process.env.NODE_ENV === 'test') {
  const testElement = document.createElement('div')
  testElement.id = 'non-modal-content'
  document.body.append(testElement)
}

Modal.setAppElement('#non-modal-content')

interface Props {
  loading: boolean
}

const classNamesModal = {
  base: styles.loader,
  afterOpen: styles.loaderOpen,
  beforeClose: styles.loaderClosed,
}

const TRANSITION_TIME_MS = 300

const style = {
  overlay: { '--transition-time': `${TRANSITION_TIME_MS}ms` } as React.CSSProperties,
}

export default function OverlayLoader({ loading }: Props) {
  return (
    <Modal
      isOpen={loading}
      className={classNamesModal}
      overlayClassName={classNamesOverlay}
      shouldCloseOnOverlayClick={false}
      style={style}
      closeTimeoutMS={TRANSITION_TIME_MS}
    >
      LOADING
    </Modal>
  )
}
