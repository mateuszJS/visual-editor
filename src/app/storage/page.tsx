'use client'

import useStorage from '@/hooks/useStorage/useStorage'
import imagePanelStyles from '@/components/shared/imagePanel.module.css'

import formatSize from '@/utils/formatSize'
import EmptyState from '@/components/EmptyState/EmptyState'
import Popover from '@/components/Popover/Popover'
import VerticalMenu from 'assets/vertical-menu.svg'
import Button from '@/components/Button/Button'
import useDeleteStorageItem from '@/hooks/useDeleteStorageItem/useDeleteStorageItem'
import styles from './storage.module.css'
import { timeAgo } from '@/utils/timeAgo'

const MAX_STORAGE = 1024 * 1024 * 5 // 5MB

export default function Explore() {
  const { loading, items } = useStorage()
  const deleteStorageItem = useDeleteStorageItem()

  const usedStorage = Array.from(items).reduce((acc, [, item]) => acc + item.size, 0)

  return (
    <main>
      <h1 className="page-title">Library</h1>
      {!loading && items.size > 0 && (
        <>
          <p className="flex space-between text-sm mx-2">
            <span>Storage</span> {formatSize(usedStorage, 2)} of {formatSize(MAX_STORAGE)} used
          </p>
          <div
            className={styles.progressBar}
            style={{ '--progress': usedStorage / MAX_STORAGE } as React.CSSProperties}
          ></div>
        </>
      )}
      <ul className={imagePanelStyles.list}>
        {Array.from(items).map(([, item]) => (
          <li
            key={item.id}
            className={imagePanelStyles.imagePanel}
            style={
              {
                '--background-url': `url(/api/storage/${item.id}/preview)`,
              } as React.CSSProperties
            }
          >
            <Popover
              variant="ghost"
              className={imagePanelStyles.menu}
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
                {item.name || timeAgo(new Date(item.updatedAt))}
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
  )
}
