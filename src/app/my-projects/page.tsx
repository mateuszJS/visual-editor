'use client'

import useProjectsList from '@/hooks/useProjectsList/useProjectsList'
import styles from '@/components/shared/imagePanel.module.css'
import ProjectPanel from '@/components/ProjectPanel/ProjectPanel'
import Navigation from '@/components/Navigation/Navigation'
import formatDate from '@/utils/formatDate'

export default function MyProjects() {
  const { loading, projectsList } = useProjectsList()

  return (
    <div className="page">
      <main>
        <h1 className="page-title">Projects</h1>
        {loading && <p>Loading...</p>}
        <ul className={styles.list}>
          {[...projectsList.values()].map((project) => (
            <li key={project.id}>
              <ProjectPanel id={project.id} text={formatDate(project.updatedAt)} />
            </li>
          ))}
        </ul>
      </main>
      <Navigation />
    </div>
  )
}
