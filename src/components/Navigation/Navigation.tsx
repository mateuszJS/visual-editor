'use client'

import HomeIcon from 'assets/home-icon.svg'
import CompassIcon from 'assets/compass-icon.svg'
import FolderIcon from 'assets/folder-icon.svg'
import ProfileIcon from 'assets/profile-icon.svg'
import userStore from '@/hooks/userStore/userStore'
import NavItem from '@/components/NavLink/NavLink'
import CreateButton from '@/components/CreateButton/CreateButton'
import { useSnapshot } from 'valtio'

export default function Navigation() {
  const { user } = useSnapshot(userStore)

  return (
    <nav className="navigation-bar">
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
