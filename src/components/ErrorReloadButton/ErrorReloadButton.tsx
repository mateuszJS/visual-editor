import Button from '../Button/Button'
import styles from './ErrorReloadButton.module.css'

type Props = {
  listName: string
}

export function ErrorReloadButton({ listName }: Props) {
  return (
    <div className={styles.root}>
      <p className="text-center mb-16">We couldn&apos;t fetch {listName}</p>
      <Button className="mx-auto" onClick={() => window.location.reload()} variant="secondary">
        Reload
      </Button>
    </div>
  )
}
