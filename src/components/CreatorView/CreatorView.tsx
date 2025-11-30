'use client'

import { useEffect, useRef } from 'react'
import cn from 'classnames'
import styles from './CreatorView.module.css'
import useCreator from '@/hooks/useCreator/useCreator'
import { ApiProjectContent } from '../../../apiTypes'

interface Props {
  project: ApiProjectContent
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
