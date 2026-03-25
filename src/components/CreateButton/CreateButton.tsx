import PlusIcon from 'assets/plus-icon.svg'
import styles from './CreateButton.module.css'
import { lazy, Suspense, useEffect } from 'react'
import Button from '@/components/Button/Button'

const NewProjectModal = lazy(() => import('@/components/NewProjectModal/NewProjectModal'))

export default function CreateButton() {
  useEffect(() => {
    import('@/components/NewProjectModal/NewProjectModal')
  }, [])

  return (
    <>
      <Button
        iconOnly
        className={styles.createButton}
        variant="ghost"
        commandfor="new-project-modal"
        command="show-modal"
      >
        <PlusIcon />
      </Button>
      <Suspense>
        <NewProjectModal />
      </Suspense>
    </>
  )
}
