'use client'

import errorStore from '@/stores/error'
import nativeFetcher from '@/utils/nativeFetcher'
import { getErrorMessage } from '@/utils/nativeFetcher/getErrorMessage'
import { proxy } from 'valtio'
import { ApiUserBasic } from '../../../apiTypes'

export interface UserStore {
  user: ApiUserBasic | null | undefined // null if not logged in, undefined if request is pending and we don't yet know
}

const userStore = proxy<UserStore>({
  user: undefined,
})

export async function initUserStore() {
  try {
    const response = await nativeFetcher<ApiUserBasic>('/api/me', {
      disableAuth401Redirect: true,
    })

    if (response.ok) {
      userStore.user = await response.json()
    } else {
      userStore.user = null
    }
  } catch (error) {
    userStore.user = null
    errorStore.message = 'Error fetching user data: ' + getErrorMessage(error)
  }
}

export default userStore
