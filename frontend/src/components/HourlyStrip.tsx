import { CloudRain, Wind } from 'lucide-react'
import { formatTime, formatValue, weatherCodeLabel } from '../lib/format'
import type { WeatherPayload } from '../types'

export function HourlyStrip({ weather }: { weather: WeatherPayload }) {
  const next24 = weather.hourly.entries.slice(0, 24)
  const quickMoments = next24.slice(0, 8)

  return (
    <div className="overflow-hidden rounded-[28px] border border-white/10 bg-white/6 p-5 shadow-glass backdrop-blur-xl">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <div className="text-xs uppercase tracking-[0.35em] text-stone-500">Next 24 hours</div>
          <div className="mt-1 text-xl text-white">Hourly outlook</div>
        </div>
        <div className="text-sm text-stone-400">Timeline view</div>
      </div>

      <div className="mb-6 grid grid-cols-4 gap-3 lg:grid-cols-8">
        {quickMoments.map((entry) => (
          <div key={`pulse-${String(entry.time)}`} className="rounded-2xl border border-white/8 bg-black/25 px-3 py-4 text-center">
            <div className="text-xs uppercase tracking-[0.25em] text-stone-500">{formatTime(String(entry.time))}</div>
            <div className="mt-3 h-16 rounded-full bg-gradient-to-t from-amber-400/10 via-white/5 to-transparent p-[1px]">
              <div
                className="mx-auto mt-auto h-full w-2 rounded-full bg-gradient-to-t from-sky-300/45 via-stone-200/70 to-amber-300/50"
                style={{
                  opacity: 0.45 + Math.min(Number(entry.precipitation_probability) || 0, 100) / 180,
                  transform: `scaleY(${0.45 + Math.min(Number(entry.wind_speed_10m) || 0, 30) / 40})`,
                }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-3 overflow-x-auto pb-2">
        {next24.map((entry) => (
          <div key={String(entry.time)} className="min-w-[180px] rounded-[24px] border border-white/10 bg-black/30 p-4">
            <div className="text-sm text-stone-300">{formatTime(String(entry.time))}</div>
            <div className="mt-3 text-3xl text-white">{formatValue(Number(entry.temperature_2m), weather.hourly.units.temperature_2m)}</div>
            <div className="mt-2 text-sm text-stone-400">{weatherCodeLabel(Number(entry.weather_code))}</div>
            <div className="mt-4 space-y-2 text-sm text-stone-300">
              <div className="flex items-center gap-2">
                <CloudRain className="h-4 w-4 text-sky-300" />
                {formatValue(Number(entry.precipitation_probability), weather.hourly.units.precipitation_probability)}
              </div>
              <div className="flex items-center gap-2">
                <Wind className="h-4 w-4 text-amber-200" />
                {formatValue(Number(entry.wind_speed_10m), weather.hourly.units.wind_speed_10m)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
