'use client'

import { initUserStore } from '@/hooks/useUserStore'
import { useEffect } from 'react'

/** This component is used to initialize all data necessary to be ready on client side */
export default function InitializeData() {
  useEffect(() => {
    // Initialize user data on the client side
    initUserStore()
  }, [])

  // This component doesn't render anything
  return null
}
