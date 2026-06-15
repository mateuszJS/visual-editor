'use client'

import useProjectsList from '@/hooks/useProjectsList/useProjectsList'
import userStore from '@/hooks/userStore/userStore'
import imagePanelStyles from '@/components/shared/imagePanel.module.css'
import ProjectPanel from '@/components/ProjectPanel/ProjectPanel'
import EmptyState from '@/components/EmptyState/EmptyState'
import LoginCTA from '@/components/LoginCTA/LoginCTA'
import Button from '@/components/Button/Button'
import { MODALS } from '@/consts'
import { ErrorReloadButton } from '@/components/ErrorReloadButton/ErrorReloadButton'
import cn from 'classnames'
import { useSnapshot } from 'valtio'

export default function MyProjects() {
  const { user } = useSnapshot(userStore)
  const { error, loading, projectsList } = useProjectsList()

  if (user === null) {
    return (
      <main>
        <h1 className="page-title">Projects</h1>
        <LoginCTA title="Sign in to view your projects" />
      </main>
    )
  }

  return (
    <main>
      <h1 className="page-title">Projects</h1>
      <div className="relative">
        {error && <ErrorReloadButton listName="your projects" />}
        <ul className={imagePanelStyles.list}>
          {loading || error
            ? Array.from({ length: 16 }, (_, index) => (
                <li
                  key={index}
                  className={cn(imagePanelStyles.skeleton, error && imagePanelStyles.errorSkeleton)}
                ></li>
              ))
            : projectsList.map((project) => (
                <li key={project.id}>
                  <ProjectPanel id={project.id} updatedAt={project.updatedAt} />
                </li>
              ))}
        </ul>
      </div>
      {!error && !loading && projectsList.length === 0 && (
        <EmptyState title="Your creative journey starts here">
          <Button commandfor={MODALS.newProjectModal} command="show-modal" className="mx-auto">
            Create Project
          </Button>
        </EmptyState>
      )}
    </main>
  )
}
