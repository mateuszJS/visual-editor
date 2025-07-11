'use client'

import { useEffect, useRef } from 'react'
import cn from 'classnames'
import styles from './styles.module.css'
import useCreator from '@/hooks/useCreator/useCreator'
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

  return <canvas className={cn(styles.root, 'child-overflow-fix')} ref={canvasRef} />
}
