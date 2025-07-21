import cn from 'classnames'
import styles from '../NavLink/NavLink.module.css'

interface Props {
  children: React.ReactNode
  onClick: VoidFunction
  disabled?: boolean
  className?: string
}

export default function NavButton({ children, onClick, disabled, className }: Props) {
  return (
    <button className={cn(styles.navItem, className)} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  )
}
