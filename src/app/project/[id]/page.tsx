'use client'

import useProject from '@/hooks/useProject/useProject'
import { useParams } from 'next/navigation'
import OverlayLoader from '@/components/OverlayLoader'
import styles from './styles.module.css'
import CreatorView from '@/components/CreatorView'
import CreatorToolbox from '@/components/CreatorToolbox/CreatorToolbox'

export default function Project() {
  const params = useParams<{ id: string }>()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { loading, error, project } = useProject(params.id)

  return (
    <div className="page">
      <main className={styles.page}>
        <OverlayLoader loading={loading} />
        <div className={styles.topNavigtion}>Navigation</div>
        {project && <CreatorView project={project} />}
      </main>
      <CreatorToolbox />
    </div>
  )
}
