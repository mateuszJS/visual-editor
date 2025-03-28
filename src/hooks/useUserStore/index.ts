'use client'

import { create } from 'zustand'

export interface User {
  picture?: string
  firstName?: string
  lastName?: string
}

export interface UserStore {
  user: User | null
  set: (user: User | null) => void
}

const useUserStore = create<UserStore>((set) => ({
  user: null,
  set: (userData) => set({ user: userData }),
}))

export async function initUserStore() {
  try {
    const response = await fetch('/api/me')

    if (response.ok) {
      const user = await response.json()
      useUserStore.setState({ user })
    }
  } catch (error) {
    console.error('Error fetching user data', error)
  }
}

export default useUserStore
