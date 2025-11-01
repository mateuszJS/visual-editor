import Link from 'next/link'
import styles from './ProjectPanel.module.css'

interface Props {
  id: string
  text: string
}
export default function ProjectPanel({ id, text }: Props) {
  return (
    <Link
      className={styles.projectPanel}
      style={{ backgroundImage: `url(/api/project-uploads/${id}/miniature)` }} // Fetch miniature from API
      href={`/project/${id}`}
      aria-label={`Go to ${text} project details`}
    >
      <p>{text}</p>
    </Link>
  )
}
