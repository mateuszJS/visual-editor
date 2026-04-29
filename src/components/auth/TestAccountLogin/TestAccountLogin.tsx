'use client'

import { setUser } from '@/hooks/userStore/userStore'
import Button from '@/components/Button/Button'
import useCSRF from '@/hooks/useCSRF/useCSRF'
import { ApiUserBasic } from '../../../../apiTypes'
import posthog from 'posthog-js'
import fetcher from '@/utils/fetcher'

interface Props {
  onSuccess: VoidFunction
}

export default function GoogleLogin({ onSuccess }: Props) {
  const getCsrfToken = useCSRF()

  async function googleLogin() {
    const csrfToken = await getCsrfToken()
    const response = await fetcher<ApiUserBasic>('/api/auth/login/google', {
      method: 'POST',
      csrfToken,
      json: { idToken: 'test-account' },
    })

    if (!('err' in response)) {
      // It's test account, we are not interested in capturing errors
      setUser(response.json)
      posthog.capture('user_logged_in', { method: 'test_account' })
      onSuccess()
    }
  }

  return (
    <Button variant="secondary" expand className="mt-16" onClick={googleLogin}>
      Use test account
    </Button>
  )
}
