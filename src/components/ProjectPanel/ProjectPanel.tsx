import Link from '@/components/Link/Link'
import VerticalMenu from 'assets/vertical-menu.svg'
import imagePanelStyles from '@/components/shared/imagePanel.module.css'
import cn from 'classnames'
import Popover from '@/components/Popover/Popover'
import Button from '@/components/Button/Button'
import useDeleteProject from '@/hooks/useDeleteProject/useDeleteProject'

interface Props {
  id: string
  text: string
}
export default function ProjectPanel({ id, text }: Props) {
  const deleteProject = useDeleteProject()

  return (
    <div
      className={cn(imagePanelStyles.imagePanel)}
      style={{ '--background-url': `url(/api/projects/${id}/miniature)` } as React.CSSProperties} // Fetch miniature from API
    >
      <Link
        href={`/project/${id}`}
        aria-label={`Go to ${text} project details`}
        className={imagePanelStyles.coverLink}
      ></Link>
      <Popover
        variant="ghost"
        className={imagePanelStyles.menu}
        iconOnly
        trigger={() => <VerticalMenu />}
      >
        <Button onClick={() => deleteProject(id)} variant="ghost" small>
          Delete Project
        </Button>
      </Popover>

      <p className="mt-auto">{text}</p>
    </div>
  )
}
