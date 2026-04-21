export function isoToSqlTimestamp(time: string) {
  return new Date(time)
    .toISOString()
    .replace('T', ' ')
    .replace(/\.\d{3}Z$/, '')
}
