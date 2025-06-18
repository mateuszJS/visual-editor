'use client'

import userStore from '@/hooks/userStore'
import Button from '@/components/Button'
import fetcher from '@/utils/fetcher'

export default function Logout() {
  const onClick = async () => {
    try {
      await fetcher('/api/auth/logout', {
        method: 'DELETE',
      })

      userStore.user = null
    } catch (err: unknown) {
      console.error(err)
    }
  }

  return <Button onClick={onClick}>Logout</Button>
}
