/* this file only exists because next.js does not allow useParams along with generateStaticParams
https://github.com/vercel/next.js/discussions/56731 */

import ProjectPage from './ProjectPage'

export const generateStaticParams = () => [{ id: '[-id]' }] // [id] doesn't exports the page, that's wy a minus was added

export default function Page() {
  return <ProjectPage />
}
