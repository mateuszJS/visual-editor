import useProject from '@/hooks/useProject/useProject'
import CreatorView from '@/components/CreatorView/CreatorView'
import { usePathname } from 'next/navigation'

export default function RawRender() {
  const pathname = usePathname()
  const id = pathname.split('/').pop()
  if (!id) {
    // it should be not possible to have no param on this route
    throw Error('Project id is missing in the URL')
  }
  const { project } = useProject(id)

  if (!project) return null

  return <CreatorView project={project} />
}
