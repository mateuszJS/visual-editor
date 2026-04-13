import { MAP_TYPE_TO_PREFIX } from '../../apiConsts'

export default function generateId(type: keyof typeof MAP_TYPE_TO_PREFIX) {
  return MAP_TYPE_TO_PREFIX[type] + crypto.randomUUID()
}
