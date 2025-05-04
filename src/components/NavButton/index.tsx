import styles from '../NavLink/styles.module.css'

interface Props {
  children: React.ReactNode
  onClick: VoidFunction
}

export default function NavButton({ children, onClick }: Props) {
  return (
    <button className={styles.navItem} onClick={onClick} type="button">
      {children}
    </button>
  )
}
