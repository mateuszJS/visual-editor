'use client'

import useUserStore from '@/hooks/useUserStore'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
/** Hook perform a redirect whenever there is no user object
 * should be used on pages which are only accessible to logged in users
 */
export default function useAuthOnly() {
  const { user } = useUserStore()
  const { push } = useRouter()

  useEffect(() => {
    if (user === null) {
      push('/')
    }
  }, [user, push])
}
