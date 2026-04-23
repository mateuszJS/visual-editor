'use client'

import classNamesOverlay from '@/components/shared/overlayStyles.module.css'
import cn from 'classnames'
import { useEffect, useState } from 'react'

interface Props {
  loading: boolean
}

const TRANSITION_TIME_MS = 300

const style = {
  '--transition-time': `${TRANSITION_TIME_MS}ms`,
} as React.CSSProperties

export default function OverlayLoader({ loading }: Props) {
  const [isVisible, setIsVisible] = useState(loading)
  const shouldRender = isVisible || loading

  useEffect(() => {
    if (loading) {
      setIsVisible(true)
      return
    }

    const timeoutId = setTimeout(() => {
      setIsVisible(false)
    }, TRANSITION_TIME_MS)
    return () => clearTimeout(timeoutId)
  }, [loading])

  if (!shouldRender) return null

  return (
    <div
      style={style}
      className={cn(classNamesOverlay.overlay, {
        [classNamesOverlay.overlayOpen]: loading,
      })}
    >
      Loading...
    </div>
  )
}
