'use client'

import fetcher from '@/utils/fetcher'
import { create } from 'zustand'

export interface User {
  picture?: string
  firstName?: string
  lastName?: string
}

export interface UserStore {
  user: User | null | undefined // null if not logged in, undefined if request is pending and we don't yet know
  set: (user: User | null) => void
}

const useUserStore = create<UserStore>((set) => ({
  user: undefined,
  set: (userData) => set({ user: userData }),
}))

export async function initUserStore() {
  try {
    const response = await fetcher('/api/me', {
      withRedirect: false,
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
