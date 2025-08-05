import styles from './ProjectPanel.module.css'

interface Props {
  id: string
  text: string
}

export default function ProjectPanel({ id, text }: Props) {
  return (
    <a
      className={styles.projectPanel}
      style={{ backgroundImage: `url(/api/projects/${id}/miniature)` }} // Fetch miniature from API
      href={`/project/${id}`}
      aria-label={`Go to ${text} project details`}
    >
      <p>{text}</p>
    </a>
  )
}
