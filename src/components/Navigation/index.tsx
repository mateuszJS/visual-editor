'use client'

import HomeIcon from 'assets/home-icon.svg'
import CompassIcon from 'assets/compass-icon.svg'
import PlusIcon from 'assets/plus-icon.svg'
import FolderIcon from 'assets/folder-icon.svg'
import ProfileIcon from 'assets/profile-icon.svg'
import styles from './styles.module.css'
import useUserStore from '@/hooks/useUserStore'
import NavLink from '@/components/NavLink'

export default function Navigation() {
  const userStore = useUserStore()

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

      <NavLink href="/new-project">
        <PlusIcon />
        Creator
      </NavLink>

      <NavLink href="/my-projects">
        <FolderIcon />
        Projects
      </NavLink>

      <NavLink href={userStore.user ? '/profile' : '/login'}>
        <ProfileIcon />
        {userStore.user ? 'Profile' : 'Login'}
      </NavLink>
    </nav>
  )
}
