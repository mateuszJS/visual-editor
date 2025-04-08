'use client'

import useUserStore from '@/hooks/useUserStore'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
/** Hook perform a redirect whenever there is a user object
 * should be used on pages which are only accessible to for unauthenticated guests
 * like login page
 */
export default function useGuestOnly() {
  const { user } = useUserStore()
  const { push } = useRouter()

  useEffect(() => {
    if (user) {
      push('/profile')
    }
  }, [user, push])
}
