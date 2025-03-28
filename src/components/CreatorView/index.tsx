'use client'

import initCreator from '@mateuszjs/magic-render'
import { ChangeEventHandler, useEffect, useRef } from 'react'

export default function CreatorView() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const creatorRef = useRef<Awaited<ReturnType<typeof initCreator>>>(null) // TODO: change type to Creator

  useEffect(() => {
    initCreator(canvasRef.current!).then((creator) => {
      creatorRef.current = creator
    })
  }, [])

  const onFileChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    const { files } = event.target as HTMLInputElement
    if (!files || files.length === 0) return

    const file = files[0]
    if (!file.type.startsWith('image/')) {
      console.error('Please select an image file')
      return
    }

    const img = new Image()
    const objectUrl = URL.createObjectURL(file)
    img.src = objectUrl
    img.onload = () => {
      creatorRef.current!.addImage(img)
    }
    img.onerror = () => {
      console.error('Failed to load the image')
      URL.revokeObjectURL(objectUrl)
    }
  }

  return (
    <div>
      <canvas ref={canvasRef}></canvas>
      <input type="file" onChange={onFileChange} />
    </div>
  )
}
