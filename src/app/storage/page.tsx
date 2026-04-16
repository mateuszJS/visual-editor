'use client'
import Navigation from '@/components/Navigation/Navigation'
import useStorage from '@/hooks/useStorage/useStorage'
import styles from '@/components/shared/imagePanel.module.css'
import formatDate from '@/utils/formatDate'
import formatSize from '@/utils/formatSize'

export default function Explore() {
  const { items } = useStorage()

  return (
    <div className="page">
      <main>
        <h1 className="page-title">Storage</h1>
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
              <p className="flex w-full">
                <span className="text-ellipsis mr-auto">
                  {item.name || formatDate(item.updatedAt)}
                </span>
                <span className="ml-16 text-nowrap">{formatSize(item.size)}</span>
              </p>
            </li>
          ))}
        </ul>
      </main>
      <Navigation />
    </div>
  )
}
