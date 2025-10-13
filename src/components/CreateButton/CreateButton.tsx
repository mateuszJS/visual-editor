import PlusIcon from 'assets/plus-icon.svg'
import styles from './CreateButton.module.css'
import { lazy, Suspense, useEffect, useState } from 'react'

const NewProjectModal = lazy(() => import('@/components/NewProjectModal/NewProjectModal'))

export default function CreateButton() {
  const [isModal, setIsModal] = useState(false)

  useEffect(() => {
    import('@/components/NewProjectModal/NewProjectModal')
  }, [])

  return (
    <>
      <button className={styles.createButton} onClick={() => setIsModal(true)} type="button">
        <PlusIcon />
      </button>
      <Suspense>
        <NewProjectModal isOpen={isModal} close={() => setIsModal(false)} />
      </Suspense>
    </>
  )
}
