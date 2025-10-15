import ActionSheets from '@/components/ActionSheets/ActionSheets'
import UploadTextures from '@/components/UploadTextures/UploadTextures'

interface Props {
  isOpen: boolean
  close: VoidFunction
  onUpload: (textureUrls: string[]) => void
}

export default function UploadModal({ isOpen, close, onUpload }: Props) {
  return (
    <ActionSheets title="Upload image" isOpen={isOpen} close={close}>
      <UploadTextures onUpload={onUpload} />
    </ActionSheets>
  )
}
