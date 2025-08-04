import errorStore from '@/stores/error'
import fetcher from '@/utils/fetcher'

export default async function onTextureUpload(url: string, setNewUrl: (newUrl: string) => void) {
  console.log(-2)
  if (!url.startsWith('blob:')) return
  console.log(-1)
  try {
    const file = await fetcher(url).then((res) => res.blob())
    const formData = new FormData()
    formData.append('file', file)
    console.log(0)
    const response = await fetcher('/api/project-textures', {
      method: 'POST',
      formData,
    })
    console.log(1, 'response.ok', response.ok, response.status)
    if (!response.ok) {
      errorStore.message = 'Failed to upload file.'
      return
    }
    console.log(2)
    const id = (await response.text()) as string
    setNewUrl(`/api/project-textures/${id}`)
  } catch (err) {
    console.error(err)
    errorStore.message = 'Failed to upload file.'
  }
}
