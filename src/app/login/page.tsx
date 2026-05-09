'use client'

import GoogleLogin from '@/components/auth/GoogleLogin/GoogleLogin'
import styles from './page.module.css'
import TestAccountLogin from '@/components/auth/TestAccountLogin/TestAccountLogin'
import { useRouter } from 'next/navigation'
import useGuestOnly from '@/hooks/useGuestOnly/useGuestOnly'
import errorStore from '@/stores/error'

export default function Login() {
  useGuestOnly()
  const router = useRouter()

  const onSuccess = () => {
    errorStore.message = null
    router.replace('/')
  }

  return (
    <main className={styles.page}>
      <div className={styles.contentWrapper}>
        <h1 className="mb-16">Sign in</h1>
        <GoogleLogin onSuccess={onSuccess} />
        <TestAccountLogin onSuccess={onSuccess} />
      </div>
    </main>
  )
}
