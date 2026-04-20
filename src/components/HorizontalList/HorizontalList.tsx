import styles from './HorizontalList.module.css'
import cn from 'classnames'

interface Props {
  children: React.ReactNode
  className?: string
}

export default function HorizontalList({ children, className }: Props) {
  return (
    <div className={cn(styles.root, className)}>
      <ul>{children}</ul>
    </div>
  )
}
