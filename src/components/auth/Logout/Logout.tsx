'use client'

import Button from '@/components/Button/Button'
import ExitIcon from 'assets/exit-icon.svg'
import styles from './Logout.module.css'
import nativeFetcher from '@/utils/nativeFetcher'

export default function Logout() {
  const onClick = async () => {
    const response = await nativeFetcher('/api/auth/logout', {
      method: 'DELETE',
    })

    if (response.ok) {
      // TODO: use BroadcastChannel to send data and clear data here?????
      window.location.reload()
    }
  }

  return (
    <Button onClick={onClick} variant="secondary" expand className={styles.btn}>
      <ExitIcon />
      Logout
    </Button>
  )
}
