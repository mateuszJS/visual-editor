import { useEffect, useState } from 'react'
import styles from './ErrorTooltip.module.css'
import cn from 'classnames'

type Props = {
  inputId: string
  msg: string
  tooltipSide: 'bottom' | 'left'
}

export default function ErrorTooltip({ inputId, msg, tooltipSide }: Props) {
  const [lastMsg, setLastMsg] = useState(msg)

  const onTransitionEnd = () => {
    if (!msg) {
      setLastMsg('')
    }
  }

  useEffect(() => {
    if (msg) {
      setLastMsg(msg)
    }
  }, [msg])

  if (!lastMsg) return null

  return (
    <p
      id={`error-${inputId}`}
      className={cn(styles.error, msg && styles.active)}
      aria-errormessage={inputId}
      data-side={tooltipSide}
      onTransitionEnd={onTransitionEnd}
    >
      {lastMsg}
    </p>
  )
}
