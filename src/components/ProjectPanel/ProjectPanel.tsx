import Link from 'next/link'
import styles from '@/components/shared/imagePanel.module.css'

interface Props {
  id: string
  text: string
}
export default function ProjectPanel({ id, text }: Props) {
  return (
    <Link
      className={styles.imagePanel}
      style={{ '--background-url': `url(/api/projects/${id}/miniature)` } as React.CSSProperties} // Fetch miniature from API
      href={`/project/${id}`}
      aria-label={`Go to ${text} project details`}
    >
      <p>{text}</p>
    </Link>
  )
}
