import { useEffect, useState } from 'react'
import throttle from 'lodash/throttle'
import { MOBILE_BREAKPOINT } from '@/consts'

export default function useIsMobile() {
  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth < MOBILE_BREAKPOINT)

  useEffect(() => {
    const handleResize = throttle(
      () => {
        setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
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
