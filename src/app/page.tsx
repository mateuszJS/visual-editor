'use client'

import Link from '@/components/Link/Link'
import useProjectsList from '@/hooks/useProjectsList/useProjectsList'
import HorizontalList from '@/components/HorizontalList/HorizontalList'
import imagePanelStyles from '@/components/shared/imagePanel.module.css'
import styles from './home.module.css'
import cn from 'classnames'

export default function HomeWrapper() {
  const projects = useProjectsList()

  return (
    <main>
      <h1>LOGO</h1>
      <section>Annoucement</section>

      {projects.projectsList.size === 0 && (
        <>
          <h2 className="subtitle">Select a template to start project</h2>
          <p>Or click + icon below</p>
        </>
      )}

      {projects.projectsList.size > 0 && (
        <>
          <h2 className="subtitle">Recent Projects</h2>
          <HorizontalList className={styles.projectsList}>
            {Array.from(projects.projectsList).map(([, project]) => (
              <li key={project.id}>
                <Link
                  className={cn(imagePanelStyles.imagePanel, styles.panel)}
                  href={`/project/${project.id}`}
                  style={
                    {
                      '--background-url': `url(/api/projects/${project.id}/miniature?t=${project.updatedAt})`,
                    } as React.CSSProperties
                  } // Fetch miniature from API
                ></Link>
              </li>
            ))}
          </HorizontalList>
        </>
      )}
      <h2 className="subtitle mt-32">Newest Effects</h2>
    </main>
  )
}
