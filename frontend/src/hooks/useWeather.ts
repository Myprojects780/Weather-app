import { useQuery } from '@tanstack/react-query'
import { fetchWeather } from '../lib/api'
import type { SelectedLocation } from '../types'

export const useWeather = (location: SelectedLocation | null) =>
  useQuery({
    queryKey: ['weather', location],
    queryFn: () => fetchWeather(location as SelectedLocation),
    enabled: Boolean(location),
    staleTime: 5 * 60 * 1000,
  })
