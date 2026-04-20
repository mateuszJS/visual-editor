'use client'

import { initUserStore } from '@/hooks/userStore/userStore'
import { initServiceWorker } from './initServiceWorker/initServiceWorker'
import { useEffect } from 'react'

/** This component is used to initialize all data necessary to be ready on client side */
export default function InitializeData() {
  useEffect(() => {
    // Initialize user data on the client side
    initUserStore()
    initServiceWorker()
  }, [])

  // This component doesn't render anything
  return null
}
