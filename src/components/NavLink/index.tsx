import Link from 'next/link'
import styles from './styles.module.css'
import { usePathname } from 'next/navigation'
import cn from 'classnames'
import type { Route } from 'next'

interface Props<T extends string> {
  children: React.ReactNode
  href: Route<T> | URL
}

export default function NavLink<T extends string>({ children, href }: Props<T>) {
  const pathname = usePathname()

  return (
    <Link
      className={cn(styles.button, {
        [styles.active]: pathname === href,
      })}
      href={href}
    >
      {children}
    </Link>
  )
}
