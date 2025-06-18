'use client'

import userStore from '@/hooks/userStore'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useSnapshot } from 'valtio'
/** Hook perform a redirect whenever there is no user object
 * should be used on pages which are only accessible to logged in users
 */
export default function useAuthOnly() {
  const { user } = useSnapshot(userStore)
  const { push } = useRouter()

  useEffect(() => {
    if (user === null) {
      push('/')
    }
  }, [user, push])
}
