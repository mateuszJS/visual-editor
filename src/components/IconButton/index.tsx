import styles from './styles.module.css'
import cn from 'classnames'

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode
  onClick: React.MouseEventHandler<HTMLButtonElement>
  className?: string
}

export default function IconButton({ className, children, onClick, ...buttonProps }: Props) {
  const classNames = cn(styles.iconButton, className)

  return (
    <button className={classNames} onClick={onClick} type="button" {...buttonProps}>
      {children}
    </button>
  )
}
