'use client'

import { useEffect, useRef } from 'react'
import styles from './styles.module.css'
import Toolbox from './components/Toolbox'
import useCreator from './useCreator'

interface Props {
  projectId: string
  width: number
  height: number
  assets: unknown[]
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function CreatorView({ projectId, width, height, assets }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const creator = useCreator()

  useEffect(() => {
    const canvas = canvasRef.current!
    creator.init(canvas, projectId)
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
