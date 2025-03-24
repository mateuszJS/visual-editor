'use client'

import initCreator from '@mateuszjs/magic-render'
import { ChangeEventHandler, useEffect, useRef } from "react"

export default function CreatorView() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const creatorRef = useRef<Awaited<ReturnType<typeof initCreator>>>(null) // TODO: change type to Creator

  useEffect(() => {
    (async () => {
      creatorRef.current = await initCreator(canvasRef.current!)
    })()
  }, [])

  const onFileChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    const { files } = (event.target as HTMLInputElement)
    if (!files) return

    const img = new Image()
    img.src = URL.createObjectURL(files[0])
    img.onload = () => {
      creatorRef.current!.addImage(img)
    }
  }

  return (
    <div>
      <canvas ref={canvasRef}></canvas>
      <input type="file" onChange={onFileChange} />
    </div>
  )
}