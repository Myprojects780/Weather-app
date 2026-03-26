import { CloudMoon, Compass, Droplets, Sunrise, Sunset, Wind } from 'lucide-react'
import { formatCompassDirection, formatTime, formatValue, weatherCodeLabel } from '../lib/format'
import type { WeatherPayload } from '../types'

export function HeroPanel({ weather }: { weather: WeatherPayload }) {
  const { current, current_units, location } = weather

  return (
    <section className="relative overflow-hidden rounded-[36px] border border-white/10 bg-gradient-to-br from-stone-900 via-stone-950 to-black p-6 shadow-glass md:p-8">
      <div className="absolute inset-0 bg-hero-glow opacity-90" />
      <div className="absolute -right-16 bottom-[-10%] h-72 w-72 rounded-full bg-amber-500/20 blur-3xl" />
      <div className="absolute left-[-12%] top-[-10%] h-60 w-60 rounded-full bg-orange-700/20 blur-3xl" />

      <div className="relative grid gap-8 xl:grid-cols-[1.2fr_0.8fr]">
        <div>
          <div className="mb-5 inline-flex items-center rounded-full border border-amber-300/20 bg-amber-300/10 px-3 py-1 text-xs uppercase tracking-[0.35em] text-amber-100">
            Let it rain
          </div>
          <div className="grid gap-4 lg:grid-cols-[0.75fr_1fr]">
            <div className="space-y-5">
              <div className="text-sm uppercase tracking-[0.35em] text-stone-400">Right now</div>
              <div>
                <h1 className="font-display text-4xl tracking-tight text-white md:text-6xl">{location.name}</h1>
                <p className="mt-2 text-stone-300">{[location.admin, location.country].filter(Boolean).join(', ') || 'Live forecast'}</p>
              </div>
              <div className="flex items-end gap-3">
                <div className="font-display text-7xl leading-none text-white md:text-8xl">{current.temperature_2m ?? '--'}</div>
                <div className="pb-3 text-xl text-stone-300">{current_units.temperature_2m}</div>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/6 px-4 py-2 text-sm text-stone-200">
                <CloudMoon className="h-4 w-4 text-amber-200" />
                {weatherCodeLabel(Number(current.weather_code))}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-[28px] border border-white/10 bg-black/30 p-5 backdrop-blur-xl">
                <div className="text-xs uppercase tracking-[0.3em] text-stone-500">Feels like</div>
                <div className="mt-3 text-4xl text-white">{formatValue(Number(current.apparent_temperature), current_units.apparent_temperature)}</div>
                <div className="mt-4 flex items-center gap-2 text-sm text-stone-400">
                  <Droplets className="h-4 w-4 text-sky-300" />
                  Humidity {formatValue(Number(current.relative_humidity_2m), current_units.relative_humidity_2m)}
                </div>
              </div>
              <div className="rounded-[28px] border border-white/10 bg-black/30 p-5 backdrop-blur-xl">
                <div className="text-xs uppercase tracking-[0.3em] text-stone-500">Wind vector</div>
                <div className="mt-3 text-4xl text-white">{formatValue(Number(current.wind_speed_10m), current_units.wind_speed_10m)}</div>
                <div className="mt-4 flex items-center gap-2 text-sm text-stone-400">
                  <Wind className="h-4 w-4 text-amber-200" />
                  {formatCompassDirection(Number(current.wind_direction_10m))}
                </div>
              </div>
              <div className="rounded-[28px] border border-white/10 bg-black/30 p-5 backdrop-blur-xl sm:col-span-2">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs uppercase tracking-[0.3em] text-stone-500">Sun cycle</div>
                    <div className="mt-2 text-2xl text-white">Daylight</div>
                  </div>
                  <div className="flex items-center gap-2 rounded-full bg-white/6 px-3 py-2 text-sm text-stone-300">
                    <Compass className="h-4 w-4 text-amber-300" />
                    {location.timezone ?? 'Auto timezone'}
                  </div>
                </div>
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-3xl bg-white/5 p-4">
                    <div className="flex items-center gap-2 text-sm text-stone-400">
                      <Sunrise className="h-4 w-4 text-amber-300" />
                      Sunrise
                    </div>
                    <div className="mt-2 text-2xl text-white">{weather.daily.entries[0]?.sunrise ? formatTime(String(weather.daily.entries[0].sunrise)) : 'Unavailable'}</div>
                  </div>
                  <div className="rounded-3xl bg-white/5 p-4">
                    <div className="flex items-center gap-2 text-sm text-stone-400">
                      <Sunset className="h-4 w-4 text-orange-300" />
                      Sunset
                    </div>
                    <div className="mt-2 text-2xl text-white">{weather.daily.entries[0]?.sunset ? formatTime(String(weather.daily.entries[0].sunset)) : 'Unavailable'}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="hidden xl:grid xl:grid-rows-[auto_1fr_auto] xl:gap-6">
          <div className="text-right font-display text-5xl leading-none text-white/95">Weather, with a sense of place.</div>
          <div className="flex items-end justify-end">
            <div className="max-w-xs text-right text-stone-400">Calm forecasts, richer detail, and a layout built to move with you from phone to desktop.</div>
          </div>
          <div className="rounded-[32px] border border-white/10 bg-black/35 p-6 text-stone-300 backdrop-blur-xl">
            Watch conditions shift through the day, then settle into the longer view.
          </div>
        </div>
      </div>
    </section>
  )
}
