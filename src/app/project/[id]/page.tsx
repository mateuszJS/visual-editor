'use client'

import useProject from '@/hooks/useProject'
import { useParams } from 'next/navigation'

export default function Project() {
  const params = useParams<{ id: string }>()
  const project = useProject(Number(params.id))

  return <h1>User&apos;s Projects</h1>
}
