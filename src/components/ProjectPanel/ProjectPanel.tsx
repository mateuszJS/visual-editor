import Link from '@/components/Link/Link'
import VerticalMenu from 'assets/vertical-menu.svg'
import imagePanelStyles from '@/components/shared/imagePanel.module.css'
import styles from './ProjectPanel.module.css'
import cn from 'classnames'
import Popover from '@/components/Popover/Popover'
import Button from '@/components/Button/Button'
import useFetcher from '@/hooks/useFetcher/useFetcher'

interface Props {
  id: string
  text: string
}
export default function ProjectPanel({ id, text }: Props) {
  const { loading, fetcher } = useFetcher()

  const deleteProject = () => {
    fetcher('api/projects/' + id, {
      method: 'DELETE',
    })
  }

  return (
    <div
      className={cn(styles.root, imagePanelStyles.imagePanel)}
      style={{ '--background-url': `url(/api/projects/${id}/miniature)` } as React.CSSProperties} // Fetch miniature from API
    >
      <Link
        href={`/project/${id}`}
        aria-label={`Go to ${text} project details`}
        className={styles.link}
      ></Link>
      {/* <Button variant="ghost" className={cn('ml-auto', styles.menu)} iconOnly>
        <VerticalMenu />
      </Button> */}

      <Popover
        variant="ghost"
        className={cn('ml-auto', styles.menu)}
        iconOnly
        trigger={() => <VerticalMenu />}
        popoverClassName={styles.popover}
      >
        <Button onClick={deleteProject}>
          Delete Project
          {loading && 'Loading'}
        </Button>
      </Popover>

      <p className="mt-auto">{text}</p>
    </div>
  )
}
