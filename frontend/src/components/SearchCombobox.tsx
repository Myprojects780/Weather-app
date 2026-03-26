import { LoaderCircle, MapPin, Search } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import clsx from 'clsx'
import { resolveSearchSelection } from '../lib/api'
import { useDebouncedValue } from '../hooks/useDebouncedValue'
import { useLocationSearch } from '../hooks/useLocationSearch'
import type { LocationSuggestion, SelectedLocation } from '../types'

interface SearchComboboxProps {
  initialValue?: string
  onSelect: (location: SelectedLocation) => void
}

const toSelectedLocation = (suggestion: LocationSuggestion): SelectedLocation => ({
  name: suggestion.name,
  admin: suggestion.admin,
  country: suggestion.country,
  latitude: suggestion.latitude,
  longitude: suggestion.longitude,
  timezone: suggestion.timezone,
})

export function SearchCombobox({ initialValue = '', onSelect }: SearchComboboxProps) {
  const [query, setQuery] = useState(initialValue)
  const [activeIndex, setActiveIndex] = useState(0)
  const [isOpen, setIsOpen] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const debouncedQuery = useDebouncedValue(query, 180)
  const { data, isFetching, isError } = useLocationSearch(debouncedQuery)
  const containerRef = useRef<HTMLDivElement>(null)
  const suggestions = data?.results ?? []

  useEffect(() => setQuery(initialValue), [initialValue])
  useEffect(() => setActiveIndex(0), [debouncedQuery])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setIsOpen(false)
    }
    window.addEventListener('mousedown', handleClickOutside)
    return () => window.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const pickSuggestion = (suggestion: LocationSuggestion) => {
    setQuery(suggestion.display_name ?? [suggestion.name, suggestion.admin, suggestion.country].filter(Boolean).join(', '))
    setSubmitError(null)
    setIsOpen(false)
    onSelect(toSelectedLocation(suggestion))
  }

  const findExactMatch = () => {
    const normalizedQuery = query.trim().toLowerCase()
    return suggestions.find((suggestion) => {
      const displayName = (suggestion.display_name ?? '').toLowerCase()
      return suggestion.name.toLowerCase() === normalizedQuery || displayName === normalizedQuery
    })
  }

  const submitSearch = async () => {
    const trimmed = query.trim()
    if (trimmed.length < 2) return

    const exactMatch = findExactMatch()
    if (exactMatch) {
      pickSuggestion(exactMatch)
      return
    }

    if (suggestions[activeIndex]) {
      pickSuggestion(suggestions[activeIndex])
      return
    }

    try {
      setIsSubmitting(true)
      setSubmitError(null)
      const suggestion = await resolveSearchSelection(trimmed)
      if (suggestion) {
        pickSuggestion(suggestion)
        return
      }
      setSubmitError('No matching places found.')
      setIsOpen(true)
    } catch {
      setSubmitError('Search is unavailable right now.')
      setIsOpen(true)
    } finally {
      setIsSubmitting(false)
    }
  }

  const helperText = submitError
    ? submitError
    : isError
      ? 'Search is unavailable right now.'
      : query.trim().length >= 2 && !isFetching && !suggestions.length && isOpen
        ? 'No matching places found.'
        : 'Try a city, coastline, or region.'

  return (
    <div className="relative" ref={containerRef}>
      <label className="mb-3 block text-xs font-semibold uppercase tracking-[0.35em] text-stone-400">
        Search
      </label>
      <div className="group flex items-center rounded-[28px] border border-white/10 bg-white/6 px-4 py-3 shadow-glass backdrop-blur-xl transition duration-300 focus-within:border-amber-300/60 focus-within:bg-white/10">
        <Search className="mr-3 h-5 w-5 text-amber-200/80" />
        <input
          value={query}
          onChange={(event) => {
            setQuery(event.target.value)
            setSubmitError(null)
            setIsOpen(true)
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={(event) => {
            if (event.key === 'ArrowDown' && suggestions.length) {
              event.preventDefault()
              setActiveIndex((current) => (current + 1) % suggestions.length)
            }
            if (event.key === 'ArrowUp' && suggestions.length) {
              event.preventDefault()
              setActiveIndex((current) => (current - 1 + suggestions.length) % suggestions.length)
            }
            if (event.key === 'Enter') {
              event.preventDefault()
              void submitSearch()
            }
            if (event.key === 'Escape') setIsOpen(false)
          }}
          placeholder="Search city or region"
          className="w-full bg-transparent text-base text-white outline-none placeholder:text-stone-500"
          autoComplete="off"
          spellCheck={false}
        />
        {isFetching || isSubmitting ? <LoaderCircle className="h-5 w-5 animate-spin text-stone-400" /> : null}
      </div>
      <div className={clsx('mt-3 text-sm', submitError || isError ? 'text-rose-300' : 'text-stone-400')}>{helperText}</div>

      {isOpen && query.trim().length >= 2 && suggestions.length ? (
        <div className="absolute z-30 mt-3 w-full overflow-hidden rounded-[28px] border border-white/10 bg-stone-950/95 shadow-2xl backdrop-blur-2xl">
          <ul className="max-h-80 overflow-auto py-2">
            {suggestions.map((suggestion, index) => (
              <li key={`${suggestion.name}-${suggestion.latitude}-${suggestion.longitude}`}>
                <button
                  type="button"
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => pickSuggestion(suggestion)}
                  className={clsx(
                    'flex w-full items-start gap-3 px-4 py-3 text-left transition',
                    index === activeIndex ? 'bg-white/10' : 'hover:bg-white/5',
                  )}
                >
                  <div className="mt-1 rounded-full bg-amber-400/15 p-2 text-amber-200">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="font-medium text-white">{suggestion.name}</div>
                    <div className="text-sm text-stone-400">
                      {suggestion.display_name ?? [suggestion.admin, suggestion.country].filter(Boolean).join(', ')}
                    </div>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  )
}
