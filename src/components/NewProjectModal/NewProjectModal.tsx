'use client'

import TikTokIcon from 'assets/tiktok-logo.svg'
import InstagramIcon from 'assets/instagram-logo.svg'
import YouTubeIcon from 'assets/youtube-logo.svg'
import styles from './NewProjectModal.module.css'
// import UploadTextures from '@/components/UploadTextures/UploadTextures'
import { useRouter } from 'next/navigation'
import OverlayLoader from '../OverlayLoader/OverlayLoader'
import ActionSheets from '../ActionSheets/ActionSheets'
import useProject from '@/hooks/useProject/useProject'
import useCreator from '@/hooks/useCreator/useCreator'
import getSizeFromImages from './getSizeFromImages'
import Button from '../Button/Button'
import StorageModal from '../StorageModal/StorageModal'
import HorizontalList from '../HorizontalList/HorizontalList'
import UploadTextures from '../UploadTextures/UploadTextures'
import { projectsListStore } from '@/hooks/useProjectsList/useProjectsList'

const blankCanvasSizes = [
  { width: 2, height: 3.3, label: 'TikTok', icon: TikTokIcon },
  { width: 2, height: 3.3, label: 'Reels', icon: InstagramIcon },
  { width: 2, height: 3.3, label: 'Story', icon: InstagramIcon },
  { width: 3.5, height: 2, label: 'YouTube', icon: YouTubeIcon },
  { width: 2.5, height: 2.5, label: '1:1' },
  { width: 2, height: 3, label: '4:5' },
  { width: 3, height: 3, label: 'Custom' },
]

export default function NewProjectModal() {
  const router = useRouter()
  const { createProject, loading } = useProject()
  const { setInitialAssets } = useCreator()

  const createProjectFrom = async (
    predefinedWidth: number,
    predefinedHeight: number,
    textureUrls: string[]
  ) => {
    const { width, height } = await getSizeFromImages(
      predefinedWidth,
      predefinedHeight,
      textureUrls
    )
    createProject(width, height, (project) => {
      setInitialAssets(project.id, textureUrls)
      projectsListStore.projects.set(project.id, project)
      close()
      router.push(`/project/${project.id}`)
    })
  }

  return (
    <ActionSheets title="Start new project" id="new-project-modal">
      <OverlayLoader loading={loading} />

      {/* <UploadTextures onUpload={(urls) => createProjectFrom(500, 500, urls)} /> */}

      <h3 className={styles.blankCanvasTitle}>Choose a blank canvas with desired size</h3>
      <HorizontalList>
        {blankCanvasSizes.map((size) => (
          <li key={size.label}>
            <Button
              variant="ghost"
              className={styles.blankCanvasOption}
              onClick={() => createProjectFrom(size.width * 500, size.height * 500, [])}
            >
              <div
                className={styles.screen}
                style={{ width: size.width + 'rem', height: size.height + 'rem' }}
              >
                {size.icon && <size.icon />}
              </div>
              <p>{size.label}</p>
            </Button>
          </li>
        ))}
      </HorizontalList>
      <p className={styles.divider}>Or</p>
      <UploadTextures onUpload={(urls) => createProjectFrom(0, 0, urls)} />
      <StorageModal />
    </ActionSheets>
  )
}
