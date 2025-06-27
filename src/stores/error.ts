import { proxy } from 'valtio'

const errorStore = proxy({
  message: null as string | null,
})

export default errorStore
