import { setupWorker } from 'msw/browser'
import handlers from './server-handlers'

const worker = setupWorker(...handlers)
export default worker
