'use client'

import { useRef } from 'react'
import userStore from '@/hooks/userStore/userStore'
import Script from 'next/script'
import Button from '@/components/Button/Button'
import GoogleIcon from 'assets/google-logo.svg'
import styles from './GoogleLogin.module.css'
import useCSRF from '@/hooks/useCSRF/useCSRF'
import useFetcher from '@/hooks/useFetcher/useFetcher'
import { SanitizedUser } from '@/types'

interface Props {
  onSuccess: VoidFunction
}

export default function GoogleLogin({ onSuccess }: Props) {
  const googleWrapper = useRef<HTMLDivElement>(null)
  const getCsrfToken = useCSRF()
  const { fetcher } = useFetcher<SanitizedUser>()

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
        fetcher(
          '/api/auth/login/google',
          {
            method: 'POST',
            csrfToken,
            json: { idToken: credential },
          },
          (user) => {
            userStore.user = user
            onSuccess()
          }
        )
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
    </>
  )
}
