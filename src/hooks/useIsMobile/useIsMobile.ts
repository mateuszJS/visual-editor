import { useEffect, useState } from 'react'
import throttle from 'lodash/throttle'
import { DESKTOP_BREAKPOINT } from '@/consts'

export default function useIsMobile() {
  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth < DESKTOP_BREAKPOINT)

  useEffect(() => {
    const handleResize = throttle(
      () => {
        setIsMobile(window.innerWidth < DESKTOP_BREAKPOINT)
      },
      300,
      { leading: true, trailing: true }
    )

    window.addEventListener('resize', handleResize)

    handleResize()

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return isMobile
}
