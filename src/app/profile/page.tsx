'use client'

import Logout from '@/components/auth/Logout/Logout'
import useAuthOnly from '@/hooks/useAuthOnly/useAuthOnly'
import userStore from '@/hooks/userStore/userStore'
import { useSnapshot } from 'valtio'
import styles from './profile.module.css'

export default function Profile() {
  useAuthOnly()
  const { user } = useSnapshot(userStore)

  return (
    <main className={styles.main}>
      {user && (
        <>
          <div className={styles.avatar}>
            <span>{(user.name || user.email)[0]}</span>
            {user.photo && (
              // eslint-disable-next-line @next/next/no-img-element
              <img alt="user photo" src={user.photo} />
            )}
          </div>
          <p className="mt-32 mx-4">{user.name}</p>
          <p>{user.email}</p>
          <Logout />
        </>
      )}
    </main>
  )
}
