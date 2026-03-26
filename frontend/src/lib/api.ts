import axios from 'axios'
import type { SearchResponse, SelectedLocation, WeatherPayload } from '../types'

const configuredBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim()
const defaultBaseUrl = import.meta.env.DEV ? '/api' : 'http://127.0.0.1:8000'

const api = axios.create({
  baseURL: configuredBaseUrl || defaultBaseUrl,
})

export const fetchSearchSuggestions = async (query: string) => {
  const response = await api.get<SearchResponse>('/search', { params: { q: query } })
  return response.data
}

export const resolveSearchSelection = async (query: string) => {
  const response = await api.get<SearchResponse>('/search', { params: { q: query } })
  return response.data.results[0] ?? null
}

export const fetchWeather = async (location: SelectedLocation) => {
  const response = await api.get<WeatherPayload>('/weather', {
    params: {
      lat: location.latitude,
      lon: location.longitude,
      name: location.name,
      admin: location.admin,
      country: location.country,
      timezone: location.timezone,
    },
  })
  return response.data
}
