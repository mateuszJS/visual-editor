import PlusIcon from 'assets/plus-icon.svg'
import styles from './styles.module.css'
import { lazy, Suspense, useEffect, useState } from 'react'

const NewProjectModal = lazy(() => import('@/components/NewProjectModal'))

export default function CreateButton() {
  const [isModal, setIsModal] = useState(false)

  useEffect(() => {
    import('@/components/NewProjectModal')
  }, [])

  return (
    <>
      <button className={styles.createButton} onClick={() => setIsModal(true)} type="button">
        <PlusIcon />
      </button>
      <Suspense fallback={<div>Loading...</div>}>
        <NewProjectModal isOpen={isModal} close={() => setIsModal(false)} />
      </Suspense>
    </>
  )
}
