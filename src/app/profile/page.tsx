'use client'

import Logout from '@/components/auth/Logout/Logout'
import useAuthOnly from '@/hooks/useAuthOnly/useAuthOnly'
import Navigation from '@/components/Navigation/Navigation'
import userStore from '@/hooks/userStore/userStore'
import { useSnapshot } from 'valtio'
import styles from './profile.module.css'

export default function Profile() {
  useAuthOnly()
  const { user } = useSnapshot(userStore)

  return (
    <div className="page">
      <main className={styles.main}>
        {user && (
          <>
            {user.photo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img className={styles.avatar} alt="user photo" src={user.photo ?? ''} />
            ) : (
              <div className={styles.avatar}>{(user.name || user.email)[0]}</div>
            )}
            <p className={styles.userName}>{user.name}</p>
            <p>{user.email}</p>
            <Logout />
          </>
        )}
      </main>
      <Navigation />
    </div>
  )
}
