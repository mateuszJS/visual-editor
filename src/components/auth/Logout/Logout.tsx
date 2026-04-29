'use client'

import Button from '@/components/Button/Button'
import ExitIcon from 'assets/exit-icon.svg'
import styles from './Logout.module.css'
import fetcher from '@/utils/fetcher'
import errorStore from '@/stores/error'
import { captureError } from '@/utils/captureError'

export default function Logout() {
  const onClick = async () => {
    const response = await fetcher('/api/auth/logout', {
      method: 'DELETE',
    })

    if ('err' in response) {
      errorStore.message = response.err || "We couldn't log you out. Please try again."
      captureError(Error('User faield to logout'))
      return
    }

    // TODO: use BroadcastChannel to send data and clear data here?????
    window.location.reload()
  }

  return (
    <Button onClick={onClick} variant="secondary" expand className={styles.btn}>
      <ExitIcon />
      Logout
    </Button>
  )
}
