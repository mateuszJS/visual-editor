import cn from 'classnames'
import NavItem from '@/components/NavLink/NavLink'
import HomeIcon from 'assets/home-icon.svg'
import QuestionMarkIcon from 'assets/question-mark-icon.svg'
import styles from './CreatorNav.module.css'

export default function CreatorNav() {
  return (
    <nav className={cn(styles.page, 'navigation-bar')}>
      <NavItem href="/">
        <HomeIcon />
      </NavItem>
      <NavItem href="/">
        <QuestionMarkIcon />
      </NavItem>
    </nav>
  )
}
