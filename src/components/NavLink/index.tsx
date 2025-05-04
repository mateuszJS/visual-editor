import Link from 'next/link'
import styles from './styles.module.css'
import { usePathname } from 'next/navigation'
import cn from 'classnames'

interface Props {
  children: React.ReactNode
  href: string
}

export default function NavLink({ children, href }: Props) {
  const pathname = usePathname()

  return (
    <Link
      className={cn(styles.navItem, {
        [styles.active]: pathname === href,
      })}
      href={href}
    >
      {children}
    </Link>
  )
}
