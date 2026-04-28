const thisYearFormatter = new Intl.DateTimeFormat(undefined, {
  month: 'long',
  day: 'numeric',
})

const previousYearFormatter = new Intl.DateTimeFormat(undefined, {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
})

export function timeAgo(timestamp: Date, locale = 'en') {
  const diff = (new Date().getTime() - timestamp.getTime()) / 1000
  const minutes = Math.floor(diff / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  const olderThanYear = days > 30 * 365
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' })

  if (olderThanYear) {
    return previousYearFormatter.format(timestamp)
  }

  if (days > 6) {
    return thisYearFormatter.format(timestamp)
  }

  if (days > 0) {
    return rtf.format(0 - days, 'day')
  }

  if (hours > 0) {
    return rtf.format(0 - hours, 'hour')
  }

  if (minutes > 0) {
    return rtf.format(0 - minutes, 'minute')
  }

  return rtf.format(Math.round(0 - diff), 'second')
}
