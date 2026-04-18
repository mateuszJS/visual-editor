import Spark from 'assets/spark.svg'
import styles from './EmptyState.module.css'
import cn from 'classnames'

interface Props {
  className?: string
  title: string
  children: React.ReactNode
}

export default function EmptyState({ className, title, children }: Props) {
  return (
    <div className={cn(styles.root, className)}>
      <h2>{title}</h2>
      {children}
      <Spark />
      <Spark />
      <Spark />
      <Spark />
      <Spark />
    </div>
  )
}
