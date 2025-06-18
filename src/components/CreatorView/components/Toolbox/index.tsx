'use client'

import styles from './styles.module.css'
import UploadButton from '../UploadButton'

export default function Toolbox() {
  return (
    <nav className={styles.toolbox}>
      <UploadButton />
    </nav>
  )
}
