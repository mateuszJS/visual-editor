'use client'

import type { SanitizedUser } from '@/app/api/utils/sanitizeUserData'
import fetcher from '@/utils/fetcher'
import { create } from 'zustand'

export interface UserStore {
  user: SanitizedUser | null | undefined // null if not logged in, undefined if request is pending and we don't yet know
  set: (user: SanitizedUser | null) => void
}

const useUserStore = create<UserStore>((set) => ({
  user: undefined,
  set: (userData) => set({ user: userData }),
}))

export async function initUserStore() {
  try {
    const response = await fetcher('/api/me', {
      disableAuth401Redirect: true,
    })

    if (response.ok) {
      const user = await response.json()
      useUserStore.setState({ user })
    } else {
      useUserStore.setState({ user: null })
    }
  } catch (error) {
    useUserStore.setState({ user: null })
    console.error('Error fetching user data', error)
  }
}

export default useUserStore
