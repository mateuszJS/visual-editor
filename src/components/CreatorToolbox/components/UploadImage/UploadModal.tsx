import ActionSheets from '@/components/ActionSheets/ActionSheets'
import UploadTextures from '@/components/UploadTextures/UploadTextures'

interface Props {
  onUpload: (textureUrls: string[]) => void
}

export default function UploadModal({ onUpload }: Props) {
  return (
    <ActionSheets id="upload-image-modal" title="Upload image">
      <UploadTextures onUpload={onUpload} />
    </ActionSheets>
  )
}
