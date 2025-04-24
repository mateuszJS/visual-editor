'use client'

import HomeIcon from 'assets/home-icon.svg'
import CompassIcon from 'assets/compass-icon.svg'
import FolderIcon from 'assets/folder-icon.svg'
import ProfileIcon from 'assets/profile-icon.svg'
import styles from './styles.module.css'
import useUserStore from '@/hooks/useUserStore'
import NavLink from '@/components/NavLink'
import CreateButton from '@/components/CreateButton'

export default function Navigation() {
  const { user } = useUserStore()

  return (
    <nav className={styles.nav}>
      <NavLink href="/">
        <HomeIcon />
        Home
      </NavLink>

      <NavLink href="/explore">
        <CompassIcon />
        Explore
      </NavLink>

      <CreateButton />

      <NavLink href="/my-projects">
        <FolderIcon />
        Projects
      </NavLink>

      <NavLink href={user ? '/profile' : '/login'}>
        <ProfileIcon />
        {user ? 'Profile' : 'Login'}
      </NavLink>
    </nav>
  )
}
