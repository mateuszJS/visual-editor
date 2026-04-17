'use client'

import useProjectsList from '@/hooks/useProjectsList/useProjectsList'
import imagePanelStyles from '@/components/shared/imagePanel.module.css'
import styles from './my-projects.module.css'
import ProjectPanel from '@/components/ProjectPanel/ProjectPanel'
import Navigation from '@/components/Navigation/Navigation'
import formatDate from '@/utils/formatDate'
import EmptyState from '@/components/EmptyState/EmptyState'

export default function MyProjects() {
  const { loading, projectsList } = useProjectsList()

  return (
    <div className="page">
      <main>
        <h1 className="page-title">Projects</h1>
        <ul className={imagePanelStyles.list}>
          {[...projectsList.values()].map((project) => (
            <li key={project.id}>
              <ProjectPanel id={project.id} text={formatDate(project.updatedAt)} />
            </li>
          ))}
          {loading &&
            Array.from({ length: 16 }, (_, index) => (
              <li key={index} className={imagePanelStyles.skeleton}></li>
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
      <Navigation />
    </div>
  )
}
