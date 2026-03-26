const numberFormatter = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 })
const compactNumberFormatter = new Intl.NumberFormat('en-US', { maximumFractionDigits: 1 })

export const formatValue = (value: number | string | null | undefined, unit?: string) => {
  if (value === null || value === undefined || value === '' || Number.isNaN(value)) {
    return 'Unavailable'
  }

  if (typeof value === 'string') {
    if (value.includes('T')) return formatDateTime(value)
    return value
  }

  const formatter = Math.abs(value) >= 100 ? numberFormatter : compactNumberFormatter
  return `${formatter.format(value)}${unit ? ` ${unit}` : ''}`
}

export const formatTime = (value: string) =>
  new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit' }).format(new Date(value))

export const formatDate = (value: string) =>
  new Intl.DateTimeFormat('en-US', { weekday: 'short', month: 'short', day: 'numeric' }).format(new Date(value))

export const formatDateTime = (value: string) =>
  new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(value))

export const formatCompassDirection = (degrees?: number | null) => {
  if (degrees === null || degrees === undefined || Number.isNaN(degrees)) return 'Unavailable'
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']
  return directions[Math.round(degrees / 45) % 8]
}

export const weatherCodeLabel = (code?: number | null) => {
  if (code === null || code === undefined || Number.isNaN(code)) return 'Unavailable'
  const map: Record<number, string> = {
    0: 'Clear',
    1: 'Mainly clear',
    2: 'Partly cloudy',
    3: 'Overcast',
    45: 'Fog',
    48: 'Rime fog',
    51: 'Light drizzle',
    53: 'Moderate drizzle',
    55: 'Dense drizzle',
    61: 'Light rain',
    63: 'Rain',
    65: 'Heavy rain',
    71: 'Light snow',
    73: 'Snow',
    75: 'Heavy snow',
    80: 'Rain showers',
    81: 'Strong showers',
    82: 'Violent showers',
    95: 'Thunderstorm',
  }
  return map[code] ?? 'Variable conditions'
}
