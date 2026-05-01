'use client'

import { initUserStore } from '@/hooks/userStore/userStore'
import { initServiceWorker } from './initServiceWorker/initServiceWorker'
import { useEffect } from 'react'
import { initializeTemplatesList } from '@/hooks/useTemplatesList/useTemplatesList'

/** This component is used to initialize all data necessary to be ready on client side */
export default function InitializeData() {
  useEffect(() => {
    // Initialize user data on the client side
    initUserStore()
    initServiceWorker()
    initializeTemplatesList()
  }, [])

  // This component doesn't render anything
  return null
}
