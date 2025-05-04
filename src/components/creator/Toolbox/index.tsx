'use client'

import styles from './styles.module.css'
import UploadButton from './components/UploadButton'

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
