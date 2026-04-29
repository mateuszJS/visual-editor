'use client'

import fetcher from '@/utils/fetcher'
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
  const response = await fetcher<ApiUserBasic>('/api/me', {
    disableAuth401Redirect: true,
  })

  if ('err' in response) {
    setUser(null)
    if (response.status !== 401) {
      captureError(Error(response.err))
      // let's silently fail, user can sign in again
    }
  } else {
    setUser(response.json)
  }
}

export default userStore
