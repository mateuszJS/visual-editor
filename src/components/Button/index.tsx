import styles from './styles.module.css'
import cn from 'classnames'

interface Props {
  type?: 'primary' | 'secondary'
  children: React.ReactNode
  onClick?: React.MouseEventHandler<HTMLButtonElement>
  expand?: boolean
  className?: string
}

export default function Button({
  type = 'primary',
  expand = false,
  className,
  children,
  onClick,
}: Props) {
  const classNames = cn(styles.button, className, {
    [styles.primary]: type === 'primary',
    [styles.secondary]: type === 'secondary',
    [styles.expand]: expand,
  })

  return (
    <button className={classNames} onClick={onClick} type="button">
      {children}
    </button>
  )
}
