'use client'

import styles from './styles.module.css'
import UploadButton from '../UploadButton'

interface Props {
  onUploadImage: VoidFunction
}

export default function Toolbox({ onUploadImage }: Props) {
  return (
    <nav className={styles.toolbox}>
      <UploadButton onUploadImage={onUploadImage} />
    </nav>
  )
}
