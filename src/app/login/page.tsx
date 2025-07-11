'use client'

import GoogleLogin from '@/components/auth/GoogleLogin/GoogleLogin'
import styles from './styles.module.css'
import Button from '@/components/Button/Button'
import { useRouter } from 'next/navigation'
import useGuestOnly from '@/hooks/useGuestOnly/useGuestOnly'
import Navigation from '@/components/Navigation/Navigation'

export default function Login() {
  useGuestOnly()
  const router = useRouter()

  const homeRedirect = () => {
    router.replace('/')
  }

  return (
    <div className="page">
      <div className={styles.page}>
        <div className={styles.contentWrapper}>
          <h1 className="mb-16">Sign in</h1>
          <GoogleLogin onSuccess={homeRedirect} />
          <Button type="secondary" expand className="mt-16">
            Another login option
          </Button>
        </div>
      </div>
      <Navigation />
    </div>
  )
}
