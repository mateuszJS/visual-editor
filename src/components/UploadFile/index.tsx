import { useEffect } from 'react'
import cn from 'classnames'
import { FileWithPath, useDropzone } from 'react-dropzone'
import styles from './styles.module.css'

interface Props {
  onUpload: (files: readonly FileWithPath[]) => void
}

export default function UploadFile({ onUpload }: Props) {
  const { acceptedFiles, getRootProps, getInputProps, isDragAccept, isDragReject } = useDropzone({
    accept: { 'image/*': [] },
    maxSize: 3000, // bytes
    maxFiles: 10,
  })

  useEffect(() => {
    if (acceptedFiles.length > 0) {
      console.log('acceptedFiles', acceptedFiles)
      onUpload(acceptedFiles)
    }
  }, [acceptedFiles])

  return (
    <div
      {...getRootProps({ className: 'dropzone' })}
      className={cn(styles.dropZone, {
        [styles.reject]: isDragReject,
      })}
    >
      <input {...getInputProps()} />
      <svg className={styles.border} xmlns="http://www.w3.org/2000/svg" fill="red">
        {/* CSS rules width: 100% doesn't trigger reflow when window size changes */}
        <rect
          className={cn(styles.borderRect, {
            [styles.borderRectActive]: isDragAccept,
          })}
          x="0"
          y="0"
          width="100%"
          height="100%"
        />
      </svg>
      <div className={styles.text}>
        <p className={styles.header}>
          {isDragReject ? 'Unsupported file type' : 'Upload an image'}
        </p>
        <p>{isDragReject ? 'only images are supported' : 'to start'}</p>
      </div>
    </div>
  )
}
