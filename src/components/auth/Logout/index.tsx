'use client'

import useUserStore from '@/hooks/useUserStore'
import { logout } from '../actions'
import Button from '@/components/Button'

export default function Logout() {
  const userStore = useUserStore()

  const onClick = async () => {
    await logout()
    userStore.set(null)
  }

  return <Button onClick={onClick}>Logout</Button>
}
