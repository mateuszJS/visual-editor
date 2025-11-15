'use client'

import useProject from '@/hooks/useProject/useProject'
import OverlayLoader from '@/components/OverlayLoader/OverlayLoader'
import styles from './ProjectPage.module.css'
import CreatorView from '@/components/CreatorView/CreatorView'
import CreatorNav from '@/components/CreatorNav/CreatorNav'
import CreatorToolbox from '@/components/CreatorToolbox/CreatorToolbox'
import { useEffect } from 'react'
import CreatorPanels from '@/components/CreatorPanels/CreatorPanels'
import useProjectId from '@/hooks/useProjectId/useProjectId'

export default function Project() {
  const id = useProjectId()
  const { loading, project } = useProject(id)

  useEffect(() => {
    const broadcast = new BroadcastChannel('sync-data')
    const intervalId = setInterval(() => {
      broadcast.postMessage('SYNC_PROJECT_DATA_START')
    }, 2 * 60 * 1000) // every 2 minutes

    return () => {
      clearInterval(intervalId)
      broadcast.postMessage('SYNC_PROJECT_DATA_START')
      broadcast.postMessage('SYNC_PROJECT_MINIATURE_START')
      broadcast.close()
    }
  }, [])

  return (
    <main className={styles.page}>
      <OverlayLoader loading={loading} />
      <CreatorNav />
      {project && <CreatorView project={project} />}
      <CreatorToolbox />
      <CreatorPanels />
    </main>
  )
}
