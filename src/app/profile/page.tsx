'use client'

import Logout from '@/components/auth/Logout'
import useAuthOnly from '@/hooks/useAuthOnly'
import Navigation from '@/components/Navigation'

export default function Profile() {
  useAuthOnly()

  return (
    <div className="page">
      <main>
        <Logout />
      </main>
      <Navigation />
    </div>
  )
}
