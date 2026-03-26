import { Sunrise, Sunset } from 'lucide-react'
import { formatDate, formatTime, formatValue, weatherCodeLabel } from '../lib/format'
import type { WeatherPayload } from '../types'

export function DailyForecastGrid({ weather }: { weather: WeatherPayload }) {
  return (
    <div className="overflow-hidden rounded-[28px] border border-white/10 bg-white/6 shadow-glass backdrop-blur-xl">
      <div className="hidden grid-cols-[1.2fr_1fr_1fr_1fr] gap-4 border-b border-white/10 px-5 py-4 text-xs uppercase tracking-[0.3em] text-stone-500 md:grid">
        <div>Day</div>
        <div>Condition</div>
        <div>Temperatures</div>
        <div>Sun cycle</div>
      </div>
      <div className="divide-y divide-white/8">
        {weather.daily.entries.map((entry) => (
          <div
            key={String(entry.time)}
            className="grid gap-4 px-5 py-5 md:grid-cols-[1.2fr_1fr_1fr_1fr] md:items-center"
          >
            <div>
              <div className="text-sm text-stone-400">{formatDate(String(entry.time))}</div>
              <div className="mt-2 text-2xl text-white">{weatherCodeLabel(Number(entry.weather_code))}</div>
            </div>
            <div className="flex items-center gap-3 text-sm text-stone-300">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-amber-300/15 to-white/5" />
              <div>Steady outlook</div>
            </div>
            <div className="flex items-baseline gap-3">
              <div className="text-3xl text-white">{formatValue(Number(entry.temperature_2m_max), weather.daily.units.temperature_2m_max)}</div>
              <div className="text-stone-400">{formatValue(Number(entry.temperature_2m_min), weather.daily.units.temperature_2m_min)}</div>
            </div>
            <div className="grid gap-2 text-sm text-stone-300">
              <div className="flex items-center gap-2">
                <Sunrise className="h-4 w-4 text-amber-300" />
                {entry.sunrise ? formatTime(String(entry.sunrise)) : 'Unavailable'}
              </div>
              <div className="flex items-center gap-2">
                <Sunset className="h-4 w-4 text-orange-300" />
                {entry.sunset ? formatTime(String(entry.sunset)) : 'Unavailable'}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
