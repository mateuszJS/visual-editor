'use client'

import Logout from '@/components/auth/Logout/Logout'
import useAuthOnly from '@/hooks/useAuthOnly/useAuthOnly'
import Navigation from '@/components/Navigation/Navigation'

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
