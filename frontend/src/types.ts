export type WeatherTab =
  | 'overview'
  | 'hourly'
  | 'daily'
  | 'precipitation'
  | 'wind'
  | 'sky'
  | 'sun'
  | 'ground'

export interface LocationSuggestion {
  id?: number | null
  name: string
  display_name?: string | null
  admin?: string | null
  country?: string | null
  latitude: number
  longitude: number
  timezone?: string | null
}

export interface SearchResponse {
  query: string
  results: LocationSuggestion[]
}

export interface WeatherPayload {
  location: {
    name: string
    latitude: number
    longitude: number
    timezone?: string | null
    country?: string | null
    admin?: string | null
  }
  current: Record<string, number | string | null>
  current_units: Record<string, string>
  hourly: {
    units: Record<string, string>
    entries: Array<Record<string, number | string | null>>
  }
  daily: {
    units: Record<string, string>
    entries: Array<Record<string, number | string | null>>
  }
  status: {
    generated_at: string
    cache_ttl_seconds: number
    hourly_points: number
    daily_points: number
    missing_current_fields: string[]
    missing_hourly_fields: string[]
    missing_daily_fields: string[]
  }
}

export interface SelectedLocation {
  name: string
  latitude: number
  longitude: number
  admin?: string | null
  country?: string | null
  timezone?: string | null
}
