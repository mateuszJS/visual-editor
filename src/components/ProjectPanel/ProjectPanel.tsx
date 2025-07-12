import styles from './ProjectPanel.module.css'

interface Props {
  id: string
  text: string
}

export default function ProjectPanel({ id, text }: Props) {
  return (
    <a
      className={styles.projectPanel}
      href={`/project/${id}`}
      aria-label={`Go to ${text} project details`}
    >
      <p>{text}</p>
    </a>
  )
}
