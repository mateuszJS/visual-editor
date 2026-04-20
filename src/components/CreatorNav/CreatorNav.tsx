import cn from 'classnames'
import NavItem from '@/components/NavLink/NavLink'
import HomeIcon from 'assets/home-icon.svg'
import QuestionMarkIcon from 'assets/question-mark-icon.svg'
import styles from './CreatorNav.module.css'
import ReverseIcon from 'assets/reverse-icon.svg'
import NavButton from '@/components/NavButton/NavButton'
import useCreator from '@/hooks/useCreator/useCreator'

const noop = () => {}

export default function CreatorNav() {
  const { undo, redo } = useCreator()

  return (
    <nav className={cn(styles.root, 'navigation-bar', 'navigation-bar-horizontal')}>
      <NavItem href="/">
        <HomeIcon />
      </NavItem>
      <NavButton onClick={undo || noop} disabled={!undo}>
        <ReverseIcon />
      </NavButton>
      <NavButton onClick={redo || noop} disabled={!redo}>
        <ReverseIcon
          style={{ transform: 'scale(-1, 1)' /* transform attribute didn't work on iOS */ }}
        />
      </NavButton>
      <NavItem href="/questions" className="ml-auto">
        <QuestionMarkIcon />
      </NavItem>
    </nav>
  )
}
