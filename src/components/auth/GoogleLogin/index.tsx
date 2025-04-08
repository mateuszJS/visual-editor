'use client'

import { useRef, useState } from 'react'
import useUserStore, { User } from '@/hooks/useUserStore'
import Script from 'next/script'
import Button from '@/components/Button'
import GoogleIcon from 'assets/google-logo.svg'
import styles from './styles.module.css'
import useCSRF from '@/hooks/useCSRF'
import fetcher from '@/utils/fetcher'

interface Props {
  onSuccess: VoidFunction
}

export default function GoogleLogin({ onSuccess }: Props) {
  const [error, setError] = useState<string | null>(null)
  const userStore = useUserStore()
  const googleWrapper = useRef<HTMLDivElement>(null)
  const getCsrfToken = useCSRF()

  const initGooglBtn = () => {
    // Migration docs: https://developers.google.com/identity/gsi/web/guides/migration
    // Status: Completed
    google.accounts.id.initialize({
      client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
      // We do not utilize "state" paremeter
      // https://developers.google.com/identity/gsi/web/guides/migration#token_response
      // Since we avoid redirects and as the docs says "Additionally, and for Redirect mode only, be sure to prevent Cross-Site Request Forgery"

      // Also we don't need/cannot use PKCE here
      // since I receive my jwt token directly, there is no redirect
      callback: async ({ credential }) => {
        const csrfToken = await getCsrfToken()
        try {
          const response = await fetcher('/api/auth/login/google', {
            method: 'POST',
            csrfToken,
            json: { idToken: credential },
          })

          const { user } = (await response.json()) as { user: User }
          if (response.status !== 200) {
            setError('Something went wrong, try again later.')
          } else {
            userStore.set(user)
            onSuccess()
          }
        } catch (err: unknown) {
          console.error(err)
          setError('Something went wrong, try again later.')
        }
      },
    })
    google.accounts.id.renderButton(
      googleWrapper.current!,
      { type: 'standard', theme: 'outline', size: 'large', width: 400 } // customization attributes
    )
    // google.accounts.id.prompt(); // display the One Tap dialog
  }

  return (
    <>
      <Script src="https://accounts.google.com/gsi/client" onReady={initGooglBtn} async />
      <Button expand className={styles.googleButton}>
        <GoogleIcon />
        <span className={styles.label}>Continue with Google</span>
        <div className={styles.googleWrapper} ref={googleWrapper} />
      </Button>
      {error && <p>{error}</p>}
    </>
  )
}
