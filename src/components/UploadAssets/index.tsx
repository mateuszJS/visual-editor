import { useEffect } from 'react'
import cn from 'classnames'
import { FileRejection, useDropzone } from 'react-dropzone'
import styles from './styles.module.css'
import useFetcher from '@/hooks/useFetcher'

interface Props {
  onUpload: (assetIds: string[]) => void
}

const MAX_FILE_SIZE_MBs = 3
const MAX_FILES_NUMBER = 10

const getRejectionReason = (fileRejections: readonly FileRejection[]) => {
  // Check if any rejection is due to file size
  const hasSizeError = fileRejections.some((rejection) =>
    rejection.errors.some((error) => error.code === 'file-too-large')
  )

  const tooManyFiles = fileRejections.some((rejection) =>
    rejection.errors.some((error) => error.code === 'too-many-files')
  )

  // Check if any rejection is due to file type
  const hasTypeError = fileRejections.some((rejection) =>
    rejection.errors.some((error) => error.code === 'file-invalid-type')
  )

  if (hasSizeError) return ['Files too large', `The maximum file size is ${MAX_FILE_SIZE_MBs}MB`]
  if (hasTypeError) return ['Unsupported file type', 'Only images only are supported']
  if (tooManyFiles) return ['Too many files', `The limit is ${MAX_FILES_NUMBER} files per project.`]
  return ['File rejected', 'Please try again with a valid files']
}

export default function UploadAsset({ onUpload }: Props) {
  const { fetcher } = useFetcher<{ id: string }>()
  const { acceptedFiles, getRootProps, getInputProps, isDragAccept, isDragReject, fileRejections } =
    useDropzone({
      accept: { 'image/*': [] },
      maxSize: MAX_FILE_SIZE_MBs * 1000 * 1000, // bytes
      maxFiles: MAX_FILES_NUMBER,
    })

  useEffect(() => {
    if (acceptedFiles.length > 0) {
      const formData = new FormData()
      formData.append('file', acceptedFiles[0])

      fetcher(
        '/api/project-assets',
        {
          method: 'POST',
          formData,
        },
        ({ id }) => onUpload([id])
      )
    }
  }, [acceptedFiles])

  const [title, subtitle] =
    fileRejections.length > 0 ? getRejectionReason(fileRejections) : ['Upload an image', 'to start']

  return (
    <div
      {...getRootProps({ className: 'dropzone' })}
      className={cn(styles.dropZone, {
        [styles.reject]: isDragReject || fileRejections.length > 0,
      })}
    >
      <input {...getInputProps()} id="upload-file-input" />
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
      <label htmlFor="upload-file-input" className={styles.text}>
        <p className={styles.header}>{title}</p>
        <p>{subtitle}</p>
      </label>
    </div>
  )
}
