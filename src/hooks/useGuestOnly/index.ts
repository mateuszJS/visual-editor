'use client'

import userStore from '@/hooks/userStore'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useSnapshot } from 'valtio'
/** Hook perform a redirect whenever there is a user object
 * should be used on pages which are only accessible to for unauthenticated guests
 * like login page
 */
export default function useGuestOnly() {
  const { user } = useSnapshot(userStore)
  const { push } = useRouter()

  useEffect(() => {
    if (user) {
      push('/profile')
    }
  }, [user, push])
}
