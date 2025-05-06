'use client'

import initCreator from '@mateuszjs/magic-render'
import { useEffect, useRef } from 'react'
import styles from './styles.module.css'
import Toolbox from './components/Toolbox'

interface Props {
  width: number
  height: number
  assets: unknown[]
}

type Creator = Awaited<ReturnType<typeof initCreator>>

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function Canvas({ width, height, assets }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const creatorRef = useRef<Creator>(null) // TODO: change type to Creator

  useEffect(() => {
    initCreator(canvasRef.current!).then((creator) => {
      creatorRef.current = creator
    })
  }, [])

  const openUploadModal = async (path: string) => {
    // A little test
    const img = new Image()
    img.src = `/api/project-assets?path=${encodeURIComponent(path)}`
  }

  return (
    <div className={styles.root}>
      <canvas className={styles.canvas} ref={canvasRef} />
      <Toolbox onUploadImage={openUploadModal} />
      <div>small sub navigation </div>
    </div>
  )
}
