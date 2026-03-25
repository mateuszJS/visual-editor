'use client'

import userStore from '@/hooks/userStore/userStore'
import Button from '@/components/Button/Button'
import useFetcher from '@/hooks/useFetcher/useFetcher'
import ExitIcon from 'assets/exit-icon.svg'
import styles from './Logout.module.css'

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

  return (
    <Button onClick={onClick} type="secondary" expand className={styles.btn}>
      <ExitIcon />
      Logout
    </Button>
  )
}
