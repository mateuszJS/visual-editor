'use client'

import errorStore from '@/stores/error'
import nativeFetcher from '@/utils/nativeFetcher'
import { getErrorMessage } from '@/utils/nativeFetcher/getErrorMessage'
import { proxy } from 'valtio'
import { ApiUserBasic } from '../../../apiTypes'
import { captureError } from '@/utils/captureError'
import posthog from 'posthog-js'
import { initializeProjectsList } from '@/hooks/useProjectsList/useProjectsList'
import { initializeStorage } from '../useStorage/useStorage'

export interface UserStore {
  user: ApiUserBasic | null | undefined // null if not logged in, undefined if request is pending and we don't yet know
}

const userStore = proxy<UserStore>({
  user: undefined,
})

export async function setUser(user: null | ApiUserBasic) {
  userStore.user = user

  if (user) {
    posthog.identify(user.id.toString(), { email: user.email })
    initializeProjectsList()
    initializeStorage()
  }
}

export async function initUserStore() {
  try {
    const response = await nativeFetcher<ApiUserBasic>('/api/me', {
      disableAuth401Redirect: true,
    })

    if (response.ok) {
      setUser(response.json)
    } else {
      setUser(null)
    }
  } catch (error) {
    captureError(error)
    setUser(null)
    errorStore.message = 'Error fetching user data: ' + getErrorMessage(error)
  }
}

export default userStore
