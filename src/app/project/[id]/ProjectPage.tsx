'use client'

import useProject from '@/hooks/useProject/useProject'
import OverlayLoader from '@/components/OverlayLoader/OverlayLoader'
import styles from './styles.module.css'
import CreatorView from '@/components/CreatorView/CreatorView'
import CreatorNav from '@/components/CreatorNav/CreatorNav'
import CreatorToolbox from '@/components/CreatorToolbox/CreatorToolbox'
import BoundsPanel from '@/components/BoundsPanel/BoundsPanel'
import useIsMobile from '@/hooks/useIsMobile/useIsMobile'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'
// import ShapePropsPanel from '@/components/ShapePropsPanel/ShapePropsPanel'

export default function Project() {
  const isMobile = useIsMobile()
  const pathname = usePathname()
  const id = pathname.split('/').pop()
  if (!id) {
    // it should be not possible to have no param on this route
    throw Error('Project id is missing in the URL')
  }
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
      {!isMobile && (
        <section className={styles.panels}>
          <BoundsPanel />
          {/* <ShapePropsPanel /> */}
        </section>
      )}
    </main>
  )
}
