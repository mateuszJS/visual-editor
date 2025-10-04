'use client'

import Button from '@/components/Button/Button'
import GoogleIcon from 'assets/google-logo.svg'
import styles from './GoogleLogin.module.css'
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth'
import getFirebase from '@/utils/getFirebase'

const provider = new GoogleAuthProvider()

interface Props {
  onSuccess: VoidFunction
}

export default function GoogleLogin({ onSuccess }: Props) {
  const signIn = () => {
    signInWithPopup(getFirebase().auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result)
        const token = credential?.accessToken
        // The signed-in user info.
        const user = result.user
        console.log('google sign in success', user, token)
        // IdP data available using getAdditionalUserInfo(result)
        // ...
        onSuccess()
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code
        const errorMessage = error.message
        // The email of the user's account used.
        const email = error.customData.email
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error)
        console.error('google sign in error', { errorCode, errorMessage, email, credential })
        // ...
      })
  }

  return (
    <>
      <Button expand onClick={signIn}>
        <GoogleIcon />
        <span className={styles.label}>Continue with Google</span>
      </Button>
    </>
  )
}
