export const MAP_TYPE_TO_PREFIX = {
  user: 'us_',
  project: 'pr_',
  storageItem: 'si_',
  s3: 's3_',
  template: 'tp_',
} as const

export default function generateId(type: keyof typeof MAP_TYPE_TO_PREFIX) {
  return MAP_TYPE_TO_PREFIX[type] + crypto.randomUUID()
}
