'use client'

import Logout from '@/components/auth/Logout/Logout'
import useAuthOnly from '@/hooks/useAuthOnly/useAuthOnly'
import userStore from '@/hooks/userStore/userStore'
import { useSnapshot } from 'valtio'
import styles from './profile.module.css'
import { useState } from 'react'

export default function Profile() {
  useAuthOnly()
  const { user } = useSnapshot(userStore)
  const [error, setError] = useState(false)

  return (
    <main className={styles.main}>
      {user && (
        <>
          {!error && user.photo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              className={styles.avatar}
              alt="user photo"
              src={user.photo}
              onError={() => setError(true)}
            />
          ) : (
            <div className={styles.avatar}>{(user.name || user.email)[0]}</div>
          )}
          <p className={styles.userName}>{user.name}</p>
          <p>{user.email}</p>
          <Logout />
        </>
      )}
    </main>
  )
}
