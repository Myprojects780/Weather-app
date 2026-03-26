import { useQuery } from '@tanstack/react-query'
import { fetchSearchSuggestions } from '../lib/api'

export const useLocationSearch = (query: string) =>
  useQuery({
    queryKey: ['search', query],
    queryFn: () => fetchSearchSuggestions(query),
    enabled: query.trim().length >= 2,
    staleTime: 15 * 60 * 1000,
  })
