'use client'

import Logout from '@/components/auth/Logout'
import useAuthOnly from '@/hooks/useAuthOnly'

export default function Profile() {
  useAuthOnly()

  return (
    <main>
      <Logout />
    </main>
  )
}
