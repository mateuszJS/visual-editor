import styles from './Button.module.css'
import cn from 'classnames'

export type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost'
  children: React.ReactNode
  onClick?: React.MouseEventHandler<HTMLButtonElement>
  expand?: boolean
  className?: string
  iconOnly?: boolean
  noHover?: boolean
}

export default function Button({
  variant = 'primary',
  expand = false,
  className,
  children,
  onClick,
  iconOnly,
  noHover,
  ...rest
}: Props) {
  const classNames = cn(styles.button, className, {
    [styles.primary]: variant === 'primary',
    [styles.secondary]: variant === 'secondary',
    [styles.ghost]: variant === 'ghost',
    [styles.expand]: expand,
    [styles.onlyIcon]: iconOnly,
    [styles.noHover]: noHover,
  })

  return (
    <button className={classNames} onClick={onClick} {...rest}>
      {children}
    </button>
  )
}
