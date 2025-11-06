'use client'

import { initUserStore } from '@/hooks/userStore/userStore'
import useServiceWorker from '@/hooks/useServiceWorker/useServiceWorker'
import { useEffect } from 'react'

/** This component is used to initialize all data necessary to be ready on client side */
export default function InitializeData() {
  useServiceWorker()

  useEffect(() => {
    // Initialize user data on the client side
    initUserStore()
  }, [])

  // This component doesn't render anything
  return null
}
