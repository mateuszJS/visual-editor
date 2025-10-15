'use client'

import useProject from '@/hooks/useProject/useProject'
import { useParams } from 'next/navigation'
import OverlayLoader from '@/components/OverlayLoader/OverlayLoader'
import styles from './styles.module.css'
import CreatorView from '@/components/CreatorView/CreatorView'
import CreatorNav from '@/components/CreatorNav/CreatorNav'
import CreatorToolbox from '@/components/CreatorToolbox/CreatorToolbox'
import BoundsPanel from '@/components/BoundsPanel/BoundsPanel'
import useIsMobile from '@/hooks/useIsMobile/useIsMobile'

export default function Project() {
  const isMobile = useIsMobile()
  const params = useParams<{ id: string }>()
  const { loading, project } = useProject(params.id)

  return (
    <main className={styles.page}>
      <OverlayLoader loading={loading} />
      <CreatorNav />
      {project && <CreatorView project={project} />}
      <CreatorToolbox />
      {!isMobile && (
        <section className={styles.panels}>
          <BoundsPanel />
        </section>
      )}
    </main>
  )
}
