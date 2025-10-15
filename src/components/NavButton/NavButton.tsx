import cn from 'classnames'
import styles from '../NavLink/NavLink.module.css'

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  className?: string
}

export default function NavButton({ children, className, ...rest }: Props) {
  return (
    <button className={cn(styles.navItem, className)} {...rest}>
      {children}
    </button>
  )
}
