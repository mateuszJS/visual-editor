import { usePathname } from 'next/navigation'

/**
 * @returns currently open project base on the URL path
 */
export default function useProjectId() {
  const pathname = usePathname()
  const id = pathname.split('/').pop()

  if (!pathname.startsWith('/project/')) {
    throw Error('Not a project page')
  }

  if (!id) {
    // it should be not possible to have no param on this route
    throw Error('Project id is missing in the URL')
  }

  return id
}
