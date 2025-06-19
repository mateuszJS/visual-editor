'use client'

import useProjectsList from '@/hooks/useProjectsList'
import styles from './styles.module.css'
import ProjectPanel from '@/components/ProjectPanel'

export default function MyProjects() {
  const { loading, error, projectsList } = useProjectsList()
  return (
    <main>
      <h1>My Projects</h1>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      <ul className={styles.list}>
        {[...projectsList.values()].map((project) => (
          <li key={project.id}>
            <ProjectPanel
              id={project.id}
              text={project.name || `Last edited at: ${project.last_updated}`}
            />
          </li>
        ))}
      </ul>
    </main>
  )
}
