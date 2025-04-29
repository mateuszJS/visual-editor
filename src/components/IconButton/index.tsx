import styles from './styles.module.css'
import cn from 'classnames'

interface Props {
  children: React.ReactNode
  onClick: React.MouseEventHandler<HTMLButtonElement>
  className?: string
}

export default function IconButton({ className, children, onClick }: Props) {
  const classNames = cn(styles.iconButton, className)

  return (
    <button className={classNames} onClick={onClick} type="button">
      {children}
    </button>
  )
}
