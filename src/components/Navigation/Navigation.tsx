'use client'

import HomeIcon from 'assets/home-icon.svg'
import StackIcon from 'assets/stack.svg'
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
        <span>Home</span>
      </NavItem>

      <NavItem href="/my-projects">
        <FolderIcon />
        Projects
      </NavItem>

      <CreateButton />

      <NavItem href="/storage">
        <StackIcon />
        &nbsp;Library
      </NavItem>

      <NavItem href={user ? '/profile' : '/login'}>
        <ProfileIcon />
        {user ? 'Profile' : 'Login'}
      </NavItem>
    </nav>
  )
}
