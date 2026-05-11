'use client'

import Link from '@/components/Link/Link'
import useProjectsList from '@/hooks/useProjectsList/useProjectsList'
import HorizontalList from '@/components/HorizontalList/HorizontalList'
import imagePanelStyles from '@/components/shared/imagePanel.module.css'
import styles from './home.module.css'
import cn from 'classnames'
import { useTemplatesList } from '@/hooks/useTemplatesList/useTemplatesList'
import { ErrorReloadButton } from '@/components/ErrorReloadButton/ErrorReloadButton'
import { TetrisGrid } from '@/components/TetrisGrid/TetrisGrid'

export default function HomeWrapper() {
  const projects = useProjectsList()
  const templates = useTemplatesList()

  return (
    <main>
      <h1>LOGO</h1>
      <section>Annoucement</section>

      {projects.projectsList.length > 0 && (
        <>
          <h2 className="subtitle">Recent Projects</h2>
          <HorizontalList className={styles.projectsList}>
            {projects.projectsList.map((project) => (
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
      <h2 className="subtitle mt-32">New Templates with Effects</h2>
      <TetrisGrid />
      <div className="relative">
        {templates.error && <ErrorReloadButton listName="the newest templates" />}
        <ul className={styles.templatesList}>
          {templates.error || templates.loading ? (
            <>
              {Array.from({ length: 16 }, (_, index) => (
                <li
                  key={index}
                  className={cn(
                    imagePanelStyles.skeleton,
                    templates.error && imagePanelStyles.errorSkeleton
                  )}
                ></li>
              ))}
            </>
          ) : (
            Array.from(templates.templatesList).map(([, project]) => (
              <li key={project.id}>
                <Link
                  className={cn(imagePanelStyles.imagePanel, styles.panel)}
                  href={`/project/${project.id}`}
                  style={
                    {
                      '--background-url': `url(${process.env.NEXT_PUBLIC_R2_ASSETS_BUCKET_URL}/templates/${project.id})`,
                    } as React.CSSProperties
                  } // Fetch miniature from API
                ></Link>
              </li>
            ))
          )}
        </ul>
      </div>
    </main>
  )
}
