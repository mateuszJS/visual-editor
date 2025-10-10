import useUniqueId from '@/hooks/useUniqueId/useUniqueId'
import styles from './Tooltip.module.css'
import useIsMobile from '@/hooks/useIsMobile/useIsMobile'

interface Props {
  children: (props: { 'aria-describedby': string }) => React.ReactNode
  tooltipContent: React.ReactNode
}

export default function Tooltip({ children, tooltipContent }: Props) {
  const isMobile = useIsMobile()
  const tooltipId = useUniqueId()
  const props = { 'aria-describedby': tooltipId }

  if (isMobile) {
    return children(props)
  }

  return (
    <div className={styles.root}>
      {children(props)}
      <div id={tooltipId} className={styles.tooltip}>
        {tooltipContent}
      </div>
    </div>
  )
}
