import styles from './HorizontalList.module.css'

interface Props {
  children: React.ReactNode
}

export default function HorizontalList({ children }: Props) {
  return (
    <div className={styles.root}>
      <ul>{children}</ul>
    </div>
  )
}
