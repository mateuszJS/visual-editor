import Link from 'next/link'
import styles from './NavLink.module.css'
import { usePathname } from 'next/navigation'
import cn from 'classnames'

interface Props {
  children: React.ReactNode
  href: string
  className?: string
}

export default function NavLink({ children, href, className }: Props) {
  const pathname = usePathname()

  return (
    <Link
      className={cn(styles.navItem, className)}
      aria-current={pathname === href ? 'page' : undefined}
      href={href}
    >
      {children}
    </Link>
  )
}
