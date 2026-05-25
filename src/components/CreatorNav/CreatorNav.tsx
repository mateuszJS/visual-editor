import cn from 'classnames'
import NavItem from '@/components/NavLink/NavLink'
import HomeIcon from 'assets/home-icon.svg'
import DownloadIcon from 'assets/download.svg'
import QuestionMarkIcon from 'assets/question-mark-icon.svg'
import styles from './CreatorNav.module.css'
import ReverseIcon from 'assets/reverse-icon.svg'
import NavButton from '@/components/NavButton/NavButton'
import useCreator from '@/hooks/useCreator/useCreator'
import { useEffect } from 'react'

const noop = () => {}

export default function CreatorNav() {
  const creatorApi = useCreator()

  useEffect(() => {
    const abortCtrl = new AbortController()
    document.addEventListener(
      'keydown',
      (event) => {
        const isInputFocused =
          document.activeElement?.tagName === 'INPUT' ||
          document.activeElement?.tagName === 'TEXTAREA'

        if (isInputFocused) return

        if (event.key === 'z' && event.metaKey) {
          if (event.shiftKey) {
            creatorApi.redo?.()
          } else {
            creatorApi.undo?.()
          }
        }
      },
      abortCtrl
    )

    return () => abortCtrl.abort()
  }, [creatorApi.redo, creatorApi.undo])

  return (
    <nav className={cn(styles.root, 'navigation-bar', 'navigation-bar-horizontal')}>
      <NavItem href="/">
        <HomeIcon />
      </NavItem>
      <NavButton onClick={creatorApi.undo || noop} disabled={!creatorApi.undo}>
        <ReverseIcon />
      </NavButton>
      <NavButton onClick={creatorApi.redo || noop} disabled={!creatorApi.redo}>
        <ReverseIcon
          style={{ transform: 'scale(-1, 1)' /* transform attribute didn't work on iOS */ }}
        />
      </NavButton>
      <NavButton className="ml-auto">
        <QuestionMarkIcon />
      </NavButton>
      <NavButton onClick={() => creatorApi.creator.download()}>
        <DownloadIcon />
      </NavButton>
    </nav>
  )
}
