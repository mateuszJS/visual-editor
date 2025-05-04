'use client'

import HomeIcon from 'assets/home-icon.svg'
import CompassIcon from 'assets/compass-icon.svg'
import FolderIcon from 'assets/folder-icon.svg'
import ProfileIcon from 'assets/profile-icon.svg'
import styles from './styles.module.css'
import useUserStore from '@/hooks/useUserStore'
import NavItem from '@/components/NavLink'
import CreateButton from '@/components/CreateButton'

export default function Navigation() {
  const { user } = useUserStore()

  return (
    <nav className={styles.nav}>
      <NavItem href="/">
        <HomeIcon />
        Home
      </NavItem>

      <NavItem href="/explore">
        <CompassIcon />
        Explore
      </NavItem>

      <CreateButton />

      <NavItem href="/my-projects">
        <FolderIcon />
        Projects
      </NavItem>

      <NavItem href={user ? '/profile' : '/login'}>
        <ProfileIcon />
        {user ? 'Profile' : 'Login'}
      </NavItem>
    </nav>
  )
}
