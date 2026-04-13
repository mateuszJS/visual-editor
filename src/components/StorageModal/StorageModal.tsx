'use client'

import UploadTextures from '@/components/UploadTextures/UploadTextures'
import OverlayLoader from '../OverlayLoader/OverlayLoader'
import ActionSheets from '../ActionSheets/ActionSheets'
import useStorage from '@/hooks/useStorage/useStorage'
import { ApiStorageItem } from '../../../apiTypes'

type Props = {
  onSelect?: (urls: string[]) => void
  onUpload?: (items: ApiStorageItem) => void
}

export default function StorageModal({ onSelect }: Props) {
  const { loading, items, upload } = useStorage()
  // const router = useRouter()
  // const { createProject, loading } = useProject()
  // const { setInitialAssets } = useCreator()

  const onUploadMedia = async (textureUrls: string[]) => {
    textureUrls.forEach((url) => upload(url))
    onSelect?.(textureUrls)
  }

  return (
    <ActionSheets title="Start new project" id="storage-modal">
      <OverlayLoader loading={loading} />
      <h3>Storage</h3>
      <UploadTextures onUpload={onUploadMedia} />
      <ul>
        {Array.from(items).map(([, item]) => (
          <li key={item.id} style={{ backgroundImage: `url(/api/storage/${item.storageId})` }}>
            <p>{item.createdAt}</p>
          </li>
        ))}
      </ul>
    </ActionSheets>
  )
}
