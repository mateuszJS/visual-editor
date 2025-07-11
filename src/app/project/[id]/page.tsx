'use client'

import useProject from '@/hooks/useProject/useProject'
import { useParams } from 'next/navigation'
import OverlayLoader from '@/components/OverlayLoader/OverlayLoader'
import styles from './styles.module.css'
import CreatorView from '@/components/CreatorView/CreatorView'
import CreatorNav from '@/components/CreatorNav/CreatorNav'
import CreatorToolbox from '@/components/CreatorToolbox/CreatorToolbox'

export default function Project() {
  const params = useParams<{ id: string }>()
  const { loading, project } = useProject(params.id)

  return (
    <main className={styles.page}>
      <OverlayLoader loading={loading} />
      <CreatorNav />
      {project && <CreatorView project={project} />}
      <CreatorToolbox />
    </main>
  )
}
