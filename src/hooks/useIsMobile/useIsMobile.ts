import { useEffect, useState } from 'react'
import { DESKTOP_BREAKPOINT } from '@/consts'

export default function useIsMobile() {
  const [isMobile, setIsMobile] = useState<boolean>(
    typeof window !== 'undefined' ? window.innerWidth < DESKTOP_BREAKPOINT : false
  )

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < DESKTOP_BREAKPOINT)
    }

    window.addEventListener('resize', handleResize)

    handleResize()

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return isMobile
}
