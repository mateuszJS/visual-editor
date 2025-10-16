'use client'

import errorStore from '@/stores/error'
import { SanitizedUser } from '@/types'
import fetcher from '@/utils/fetcher'
import { getErrorMessage } from '@/utils/fetcher/getErrorMessage'
import { proxy } from 'valtio'

export interface UserStore {
  user: SanitizedUser | null | undefined // null if not logged in, undefined if request is pending and we don't yet know
}

const userStore = proxy<UserStore>({
  user: undefined,
})

export async function initUserStore() {
  try {
    const response = await fetcher('/api/me', {
      disableAuth401Redirect: true,
    })

    if (response.ok) {
      userStore.user = (await response.json()) as SanitizedUser
    } else {
      userStore.user = null
    }
  } catch (error) {
    userStore.user = null
    errorStore.message = 'Error fetching user data: ' + getErrorMessage(error)
  }
}

export default userStore
