import ProjectPage from './ProjectPage'

export const generateStaticParams = () => [{ id: '[-id]' }, { id: '1' }] // [id] doesn't exports the page, that's why a minus was added
// generateStaticParams can be used only in server-components
// otherwise it would be part of ProjectPage

export default function Page() {
  return <ProjectPage />
}
