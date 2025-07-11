import styles from '../NavLink/NavLink.module.css'

interface Props {
  children: React.ReactNode
  onClick: VoidFunction
}

export default function NavButton({ children, onClick }: Props) {
  return (
    <button className={styles.navItem} onClick={onClick}>
      {children}
    </button>
  )
}
