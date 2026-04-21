import Link from '@/components/Link/Link'
import VerticalMenu from 'assets/vertical-menu.svg'
import imagePanelStyles from '@/components/shared/imagePanel.module.css'
import cn from 'classnames'
import Popover from '@/components/Popover/Popover'
import Button from '@/components/Button/Button'
import useDeleteProject from '@/hooks/useDeleteProject/useDeleteProject'
import formatDate from '@/utils/formatDate'

interface Props {
  id: string
  updatedAt: string
}
export default function ProjectPanel({ id, updatedAt }: Props) {
  const deleteProject = useDeleteProject()

  const formattedUpdatedAt = formatDate(updatedAt)

  return (
    <div
      className={cn(imagePanelStyles.imagePanel)}
      style={
        {
          '--background-url': `url(/api/projects/${id}/miniature?t=${updatedAt})`,
        } as React.CSSProperties
      } // Fetch miniature from API
    >
      <Link
        href={`/project/${id}`}
        aria-label={`Go to ${formattedUpdatedAt} project details`}
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

      <p className="mt-auto">{formattedUpdatedAt}</p>
    </div>
  )
}
