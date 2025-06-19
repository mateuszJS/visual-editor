'use client'

import Modal from 'react-modal'
import TikTokIcon from 'assets/tiktok-logo.svg'
import InstagramIcon from 'assets/instagram-logo.svg'
import YouTubeIcon from 'assets/youtube-logo.svg'
import styles from './styles.module.css'
import UploadFile from '@/components/UploadFile'
import type { FileWithPath } from 'react-dropzone'
import loadImageFromFile from '@/utils/loadImageFromFile'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import OverlayLoader from '../OverlayLoader'
import ActionSheets from '../ActionSheets'
import useProject from '@/hooks/useProject/useProject'

if (process.env.NODE_ENV !== 'test') {
  Modal.setAppElement('#non-modal-content')
}

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
  const { createProject, loading, project } = useProject()

  useEffect(() => {
    if (project) {
      close()
      router.push(`/project/${project.id}`)
    }
  }, [project])

  const createProjectFromFiles = async (files: readonly FileWithPath[]) => {
    const images = await Promise.all(files.map(loadImageFromFile))
    const projectSize = images.reduce(
      (maxSize, img) => ({
        width: Math.max(maxSize.width, img.width),
        height: Math.max(maxSize.height, img.height),
      }),
      { width: 0, height: 0 }
    )

    createProject(projectSize.width, projectSize.height, images)
  }

  return (
    <ActionSheets isOpen={isOpen} close={close} title="Start new project">
      <OverlayLoader loading={loading} />
      <UploadFile onUpload={createProjectFromFiles} />
      <p className={styles.divider}>Or</p>
      <h3 className={styles.blankCanvasTitle}>Choose a blank canvas with desired size</h3>
      <ul className={styles.blankCanvasList}>
        {blankCanvasSizes.map((size) => (
          <li key={size.label}>
            <button
              className={styles.blankCanvasOption}
              onClick={() => createProject(size.width * 500, size.height * 500, [])}
              type="button"
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
