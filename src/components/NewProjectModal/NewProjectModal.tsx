'use client'

import TikTokIcon from 'assets/tiktok-logo.svg'
import InstagramIcon from 'assets/instagram-logo.svg'
import YouTubeIcon from 'assets/youtube-logo.svg'
import styles from './NewProjectModal.module.css'
import UploadTextures from '@/components/UploadTextures/UploadTextures'
import { useRouter } from 'next/navigation'
import OverlayLoader from '../OverlayLoader/OverlayLoader'
import ActionSheets from '../ActionSheets/ActionSheets'
import useProject from '@/hooks/useProject/useProject'
import useCreator from '@/hooks/useCreator/useCreator'

interface Props {
  isOpen: boolean
  close: VoidFunction
}

const blankCanvasSizes = [
  { width: 2, height: 3.3, label: 'TikTok', icon: TikTokIcon },
  { width: 2, height: 3.3, label: 'Reels', icon: InstagramIcon },
  { width: 2, height: 3.3, label: 'Story', icon: InstagramIcon },
  { width: 3.5, height: 2, label: 'YouTube', icon: YouTubeIcon },
  { width: 2.5, height: 2.5, label: '1:1' },
  { width: 2, height: 3, label: '4:5' },
  { width: 3, height: 3, label: 'Custom' },
]

export default function NewProjectModal({ isOpen, close }: Props) {
  const router = useRouter()
  const { createProject, loading } = useProject()
  const { setInitialAssets } = useCreator()

  const createProjectFrom = async (width: number, height: number, textureUrls: string[]) => {
    // const images = await loadImagesFromAssetIds(assetIds)

    // const projectSize = images.reduce(
    //   (maxSize, img) => ({
    //     width: Math.max(maxSize.width, img.width),
    //     height: Math.max(maxSize.height, img.height),
    //   }),
    //   { width, height }
    // )

    createProject(500, 500, (project) => {
      setInitialAssets(project.id, textureUrls)
      close()
      router.push(`/project/${project.id}`)
    })
  }

  return (
    <ActionSheets isOpen={isOpen} close={close} title="Start new project">
      <OverlayLoader loading={loading} />
      <UploadTextures onUpload={(textureUrls) => createProjectFrom(0, 0, textureUrls)} />
      <p className={styles.divider}>Or</p>
      <h3 className={styles.blankCanvasTitle}>Choose a blank canvas with desired size</h3>
      <ul className={styles.blankCanvasList}>
        {blankCanvasSizes.map((size) => (
          <li key={size.label}>
            <button
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
            </button>
          </li>
        ))}
      </ul>
    </ActionSheets>
  )
}
