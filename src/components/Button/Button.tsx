import styles from './Button.module.css'
import cn from 'classnames'
import Link from '@/components/Link/Link'

type SharedButtonProps = {
  variant?: 'primary' | 'secondary' | 'ghost' | 'chunky'
  children: React.ReactNode
  expand?: boolean
  iconOnly?: boolean
  noHover?: boolean
  small?: boolean
}

export type Props = SharedButtonProps &
  (
    | ({ href?: undefined } & React.ButtonHTMLAttributes<HTMLButtonElement>)
    | ({ href: string } & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'>)
  )

export default function Button({
  variant = 'primary',
  expand = false,
  className,
  children,
  iconOnly,
  noHover,
  small,
  href,
  ...rest
}: Props) {
  const classNames = cn(styles.button, className, {
    [styles.primary]: variant === 'primary',
    [styles.secondary]: variant === 'secondary',
    [styles.ghost]: variant === 'ghost',
    [styles.chunky]: variant === 'chunky',
    [styles.expand]: expand || variant === 'chunky',
    [styles.onlyIcon]: iconOnly,
    [styles.noHover]: noHover,
    [styles.small]: small,
  })

  if (href) {
    const linkRest = rest as Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'>

    return (
      <Link href={href} className={classNames} {...linkRest}>
        {children}
      </Link>
    )
  }

  const buttonRest = rest as React.ButtonHTMLAttributes<HTMLButtonElement>

  return (
    <button className={classNames} {...buttonRest}>
      {children}
    </button>
  )
}
