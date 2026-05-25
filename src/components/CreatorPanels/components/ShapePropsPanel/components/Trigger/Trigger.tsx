import styles from './Trigger.module.css'

interface Props {
  name: string
  type: 'a' | 'c' | 'd' | 't'
  children: React.ReactNode
}

export function Trigger({ name, type, children }: Props) {
  return (
    <div className={styles.root}>
      <div>
        <p>{name}</p>
        <p className={styles.type}>{type}</p>
      </div>
      {children}
    </div>
  )
}
