'use client'

import { initUserStore } from '@/hooks/userStore/userStore'
import { useEffect } from 'react'

/** This component is used to initialize all data necessary to be ready on client side */
export default function InitializeData() {
  useEffect(() => {
    // Initialize user data on the client side
    initUserStore()

    const registerServiceWorker = async () => {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js')
        window.addEventListener('pagehide', () => {
          registration.active?.postMessage('CLIENT_CLOSED')
        })
      } catch (error) {
        console.error(`Registration failed with ${error}`)
      }
    }

    if ('serviceWorker' in navigator) {
      registerServiceWorker()
    }
  }, [])

  // This component doesn't render anything
  return null
}
