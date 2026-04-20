'use client'

import useProjectsList from '@/hooks/useProjectsList/useProjectsList'
import imagePanelStyles from '@/components/shared/imagePanel.module.css'
import styles from './my-projects.module.css'
import ProjectPanel from '@/components/ProjectPanel/ProjectPanel'
import formatDate from '@/utils/formatDate'
import EmptyState from '@/components/EmptyState/EmptyState'

export default function MyProjects() {
  const { loading, projectsList } = useProjectsList()

  return (
    <main>
      <h1 className="page-title">Projects</h1>
      <ul className={imagePanelStyles.list}>
        {loading
          ? Array.from({ length: 16 }, (_, index) => (
              <li key={index} className={imagePanelStyles.skeleton}></li>
            ))
          : [...projectsList.values()].map((project) => (
              <li key={project.id}>
                <ProjectPanel id={project.id} text={formatDate(project.updatedAt)} />
              </li>
            ))}
      </ul>
      {!loading && projectsList.size === 0 && (
        <EmptyState title="Your creative journey starts here">
          <p className="text-balance">
            Click the <span className={styles.plus}>+</span> button below to start a new project!
          </p>
        </EmptyState>
      )}
    </main>
  )
}
