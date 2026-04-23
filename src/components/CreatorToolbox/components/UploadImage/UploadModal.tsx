import ActionSheets from '@/components/ActionSheets/ActionSheets'
import UploadTextures from '@/components/UploadTextures/UploadTextures'
import { MODALS } from '@/consts'

interface Props {
  onUpload: (textureUrls: string[]) => void
}

export default function UploadModal({ onUpload }: Props) {
  return (
    <ActionSheets id={MODALS.uploadImageModal} title="Upload image">
      <UploadTextures onUpload={onUpload} />
    </ActionSheets>
  )
}
