import Link from '@/components/Link/Link'
import VerticalMenu from 'assets/vertical-menu.svg'
import imagePanelStyles from '@/components/shared/imagePanel.module.css'
import styles from './ProjectPanel.module.css'
import Button from '../Button/Button'
import cn from 'classnames'

interface Props {
  id: string
  text: string
}
export default function ProjectPanel({ id, text }: Props) {
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
      <Button variant="ghost" className={cn('ml-auto', styles.menu)} iconOnly>
        <VerticalMenu />
      </Button>
      <p className="mt-auto">{text}</p>
    </div>
  )
}
