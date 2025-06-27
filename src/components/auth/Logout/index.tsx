'use client'

import userStore from '@/hooks/userStore'
import Button from '@/components/Button'
import useFetcher from '@/hooks/useFetcher'

export default function Logout() {
  const { fetcher } = useFetcher<void>()
  const onClick = () => {
    fetcher(
      '/api/auth/logout',
      {
        method: 'DELETE',
      },
      () => {
        userStore.user = null
      }
    )
  }

  return <Button onClick={onClick}>Logout</Button>
}
