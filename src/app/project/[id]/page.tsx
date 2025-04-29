'use client'

import useProject from '@/hooks/projects/useProject'
import { useParams } from 'next/navigation'

export default function Project() {
  const params = useParams<{ id: string }>()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const project = useProject(Number(params.id))

  return <h1>User&apos;s Projects</h1>
}
