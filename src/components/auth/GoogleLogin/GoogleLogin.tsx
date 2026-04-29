'use client'

import { useRef } from 'react'
import { setUser } from '@/hooks/userStore/userStore'
import Script from 'next/script'
import posthog from 'posthog-js'
import Button from '@/components/Button/Button'
import GoogleIcon from 'assets/google-logo.svg'
import styles from './GoogleLogin.module.css'
import useCSRF from '@/hooks/useCSRF/useCSRF'
import getUserAgent from '@/utils/getUserAgent'
import { ApiUserBasic } from '../../../../apiTypes'
import fetcher from '@/utils/fetcher'
import { captureError } from '@/utils/captureError'
import errorStore from '@/stores/error'

interface Props {
  onSuccess: VoidFunction
}

export default function GoogleLogin({ onSuccess }: Props) {
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
        const response = await fetcher<ApiUserBasic>('/api/auth/login/google', {
          method: 'POST',
          csrfToken,
          json: { idToken: credential, userAgent: getUserAgent() },
        })

        if ('err' in response) {
          captureError(Error(response.err))
          errorStore.message =
            'Failed to sign in with Google. Please try again or use a different sign in method.'
          return
        }

        setUser(response.json)
        posthog.capture('user_logged_in', { method: 'google' })
        onSuccess()
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
