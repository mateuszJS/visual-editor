'use client'

import { startTransition, useActionState, useEffect, useRef } from 'react'
import { googleLogin } from '../actions'
import useUserStore from '@/hooks/useUserStore'
import Script from 'next/script'
import Button from '@/components/Button'
import GoogleIcon from 'assets/google-logo.svg'
import styles from './styles.module.css'

interface Props {
  onSuccess: VoidFunction
}

export default function GoogleLogin({ onSuccess }: Props) {
  const [loginState, loginAction] = useActionState(googleLogin, undefined)
  const userStore = useUserStore()
  const googleWrapper = useRef<HTMLDivElement>(null)

  const initGooglBtn = () => {
    // Migration docs: https://developers.google.com/identity/gsi/web/guides/migration
    // Status: Completed
    google.accounts.id.initialize({
      client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
      callback: (response) => {
        startTransition(() => {
          loginAction(response.credential)
        })
      },
    })
    google.accounts.id.renderButton(
      googleWrapper.current!,
      { type: 'standard', theme: 'outline', size: 'large', width: 400 } // customization attributes
    )
    // google.accounts.id.prompt(); // display the One Tap dialog
  }

  useEffect(() => {
    if (loginState?.userData) {
      userStore.set(loginState?.userData)
      onSuccess()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loginState?.userData])

  return (
    <>
      <Script src="https://accounts.google.com/gsi/client" onReady={initGooglBtn} async />
      <Button expand className={styles.googleButton}>
        <GoogleIcon />
        <span className={styles.label}>Continue with Google</span>
        <div className={styles.googleWrapper} ref={googleWrapper} />
      </Button>
      {loginState?.error && <p>Error</p>}
    </>
  )
}
