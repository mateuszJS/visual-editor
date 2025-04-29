'use client'

import Modal from 'react-modal'
import styles from './styles.module.css'
import classNamesOverlay from '@/components/shared/overlayStyles'

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
