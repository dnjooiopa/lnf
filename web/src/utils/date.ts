const Minute = 60
const Hour = 3600
const Day = 86400
const Month = 30 * 86400
const Year = 365 * 86400

export const shortenTime = (d: Date) => {
  const now = new Date()

  let duration = (now.getTime() - d.getTime()) / 1000

  if (duration < Minute) {
    return 'a few seconds ago'
  }

  if (duration < Hour) {
    duration = Number.parseInt(String(duration / Minute))
    if (duration === 1) {
      return 'a minute ago'
    }
    return duration + ' minutes ago'
  }

  if (duration < Day) {
    duration = Number.parseInt(String(duration / Hour))
    if (duration === 1) {
      return 'an hour ago'
    }
    return duration + ' hours ago'
  }

  if (duration < Month) {
    duration = Number.parseInt(String(duration / Day))
    if (duration === 1) {
      return 'a day ago'
    }
    return duration + ' days ago'
  }

  if (duration < Year) {
    duration = Number.parseInt(String(duration / Month))
    if (duration === 1) {
      return 'a month ago'
    }
    return duration + ' months ago'
  }

  duration = Number.parseInt(String(duration / Year))
  if (duration === 1) {
    return 'a year ago'
  }
  return duration + ' years ago'
}
