'use client'

import useProject from '@/hooks/projects/useProject'
import { useParams } from 'next/navigation'
import OverlayLoader from '@/components/OverlayLoader'
import styles from './styles.module.css'
import CreatorView from '@/components/CreatorView'

export default function Project() {
  const params = useParams<{ id: string }>()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { loading, error, project } = useProject(params.id)

  return (
    <main className={styles.page}>
      <OverlayLoader loading={loading} />
      <div className={styles.topNavigtion}>Navigation</div>
      {project && <CreatorView project={project} />}
    </main>
  )
}
