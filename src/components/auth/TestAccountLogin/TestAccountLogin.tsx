'use client'

import userStore from '@/hooks/userStore/userStore'
import Button from '@/components/Button/Button'
import useCSRF from '@/hooks/useCSRF/useCSRF'
import useFetcher from '@/hooks/useFetcher/useFetcher'
import { ApiUserBasic } from '../../../../apiTypes'

interface Props {
  onSuccess: VoidFunction
}

export default function GoogleLogin({ onSuccess }: Props) {
  const getCsrfToken = useCSRF()
  const { fetcher } = useFetcher<ApiUserBasic>()

  async function googleLogin() {
    const csrfToken = await getCsrfToken()
    fetcher(
      '/api/auth/login/google',
      {
        method: 'POST',
        csrfToken,
        json: { idToken: 'test-account' },
      },
      (user) => {
        userStore.user = user
        onSuccess()
      }
    )
  }

  return (
    <Button variant="secondary" expand className="mt-16" onClick={googleLogin}>
      Use test account
    </Button>
  )
}
