import ErrorMarkIcon from 'assets/exclamation-mark-icon.svg'
import CloseIcon from 'assets/close-icon.svg'
import IconButton from '../IconButton'
import styles from './ErrorToast.module.css'

interface Props {
  error: string
  close: VoidFunction
}

export default function ErrorToast({ error, close }: Props) {
  return (
    <section aria-live="assertive" role="alert" className={styles.root}>
      <ErrorMarkIcon className={styles.errorIcon} />
      <p>{error}</p>
      <IconButton onClick={close} aria-label="Close" className={styles.closeButton}>
        <CloseIcon />
      </IconButton>
    </section>
  )
}
