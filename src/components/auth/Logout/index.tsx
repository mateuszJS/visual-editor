'use client'

import useUserStore from '@/hooks/useUserStore'
import Button from '@/components/Button'
import fetcher from '@/utils/fetcher'

export default function Logout() {
  const userStore = useUserStore()

  const onClick = async () => {
    try {
      await fetcher('/api/auth/logout', {
        method: 'DELETE',
      })

      userStore.set(null)
    } catch (err: unknown) {
      console.error(err)
    }
  }

  return <Button onClick={onClick}>Logout</Button>
}
