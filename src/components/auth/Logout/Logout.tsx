'use client'

import userStore from '@/hooks/userStore/userStore'
import Button from '@/components/Button/Button'
import useFetcher from '@/hooks/useFetcher/useFetcher'

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
