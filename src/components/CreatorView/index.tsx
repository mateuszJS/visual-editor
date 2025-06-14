'use client'

import { useEffect, useRef } from 'react'
import styles from './styles.module.css'
import Toolbox from './components/Toolbox'
import useCreator from './useCreator'
import type { SanitizedProject } from '@/app/api/utils/sanitizeProjectData'

interface Props {
  project: SanitizedProject
}

export default function CreatorView({ project }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const creator = useCreator()

  useEffect(() => {
    const canvas = canvasRef.current!
    creator.init(canvas, project)
    return creator.destroy.bind(null, canvas)
  }, [])

  return (
    <div className={styles.root}>
      <canvas className={styles.canvas} ref={canvasRef} />
      {creator.isReady ? <Toolbox /> : <div>small sub navigation</div>}
      <div>navigation</div>
    </div>
  )
}
