import useUniqueId from '@/hooks/useUniqueId/useUniqueId'
import styles from './Tooltip.module.css'
import useIsMobile from '@/hooks/useIsMobile/useIsMobile'

interface Props {
  children: (props: { 'aria-describedby'?: string }) => React.ReactNode
  tooltipContent: React.ReactNode
}

export default function Tooltip({ children, tooltipContent }: Props) {
  const isMobile = useIsMobile()
  const tooltipId = useUniqueId()
  const props = {
    'aria-describedby': tooltipId,
    suppressHydrationWarning: true,
  }

  if (isMobile) {
    // no tooltip on mobile, so no need for aria-describedby
    return children({})
  }

  return (
    <div className={styles.root}>
      {children(props)}
      <div id={tooltipId} suppressHydrationWarning className={styles.tooltip}>
        {tooltipContent}
      </div>
    </div>
  )
}
