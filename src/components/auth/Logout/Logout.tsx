'use client'

import userStore from '@/hooks/userStore/userStore'
import Button from '@/components/Button/Button'
import useFetcher from '@/hooks/useFetcher/useFetcher'

export default function Logout() {
  const { fetcher } = useFetcher()

  const onClick = async () => {
    fetcher(
      '/api/auth/logout',
      {
        method: 'DELETE',
      },
      () => {
        userStore.user = null
        window.location.reload()
      }
    )
  }

  return <Button onClick={onClick}>Logout</Button>
}
