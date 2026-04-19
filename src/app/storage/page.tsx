'use client'
import Navigation from '@/components/Navigation/Navigation'
import useStorage from '@/hooks/useStorage/useStorage'
import styles from '@/components/shared/imagePanel.module.css'
import formatDate from '@/utils/formatDate'
import formatSize from '@/utils/formatSize'
import EmptyState from '@/components/EmptyState/EmptyState'
import Popover from '@/components/Popover/Popover'
import VerticalMenu from 'assets/vertical-menu.svg'
import Button from '@/components/Button/Button'
import useDeleteStorageItem from '@/hooks/useDeleteStorageItem/useDeleteStorageItem'

export default function Explore() {
  const { loading, items } = useStorage()
  const deleteStorageItem = useDeleteStorageItem()

  return (
    <div className="page">
      <main>
        <h1 className="page-title">Library</h1>
        <ul className={styles.list}>
          {Array.from(items).map(([, item]) => (
            <li
              key={item.id}
              className={styles.imagePanel}
              style={
                {
                  '--background-url': `url(/api/storage/${item.id}/preview)`,
                } as React.CSSProperties
              }
            >
              <Popover
                variant="ghost"
                className={styles.menu}
                iconOnly
                trigger={() => <VerticalMenu />}
                popoverClassName={styles.popover}
              >
                <Button onClick={() => deleteStorageItem(item.id)} variant="ghost" small>
                  Delete Asset
                </Button>
              </Popover>
              <p className="flex w-full mt-auto">
                <span className="text-ellipsis mr-auto">
                  {item.name || formatDate(item.updatedAt)}
                </span>
                <span className="ml-16 text-nowrap">{formatSize(item.size)}</span>
              </p>
            </li>
          ))}
        </ul>
        {!loading && items.size === 0 && (
          <EmptyState title="Library">
            <p className="text-balance">
              Manage your images, fonts & brand files across all projects.
            </p>
          </EmptyState>
        )}
      </main>
      <Navigation />
    </div>
  )
}
