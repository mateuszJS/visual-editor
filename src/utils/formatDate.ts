const formatter = new Intl.DateTimeFormat(undefined, {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
})

export default function formatDate(time: string) {
  const date = new Date(time)
  return formatter.format(date)
}
