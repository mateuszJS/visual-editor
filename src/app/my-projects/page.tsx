'use client'

import useProjectsList from '@/hooks/useProjectsList/useProjectsList'
import imagePanelStyles from '@/components/shared/imagePanel.module.css'
import ProjectPanel from '@/components/ProjectPanel/ProjectPanel'
import EmptyState from '@/components/EmptyState/EmptyState'
import Button from '@/components/Button/Button'
import { MODALS } from '@/consts'

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
                <ProjectPanel id={project.id} updatedAt={project.updatedAt} />
              </li>
            ))}
      </ul>
      {!loading && projectsList.size === 0 && (
        <EmptyState title="Your creative journey starts here">
          <Button commandfor={MODALS.newProjectModal} command="show-modal" className="mx-auto">
            Create Project
          </Button>
        </EmptyState>
      )}
    </main>
  )
}
