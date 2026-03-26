import { AlertTriangle, CloudRain, Compass, Eye, Gauge, Layers3, Sprout, SunMedium, Sunrise, Sunset, Wind } from 'lucide-react'
import { BrandLogo } from './components/BrandLogo'
import { DailyForecastGrid } from './components/DailyForecastGrid'
import { EmptyState } from './components/EmptyState'
import { HeroPanel } from './components/HeroPanel'
import { HourlyStrip } from './components/HourlyStrip'
import { InstallAppButton } from './components/InstallAppButton'
import { MetricCard } from './components/MetricCard'
import { SearchCombobox } from './components/SearchCombobox'
import { SectionShell } from './components/SectionShell'
import { TabNav } from './components/TabNav'
import { WeatherSkeleton } from './components/WeatherSkeleton'
import { useInstallPrompt } from './hooks/useInstallPrompt'
import { useLocalStorage } from './hooks/useLocalStorage'
import { useWeather } from './hooks/useWeather'
import { formatCompassDirection, formatDateTime, weatherCodeLabel } from './lib/format'
import type { SelectedLocation, WeatherTab } from './types'

const defaultLocation: SelectedLocation = {
  name: 'New Delhi',
  admin: 'Delhi',
  country: 'India',
  latitude: 28.6139,
  longitude: 77.209,
  timezone: 'Asia/Kolkata',
}

function App() {
  const [selectedLocation, setSelectedLocation] = useLocalStorage<SelectedLocation | null>('let-it-rain:last-location', defaultLocation)
  const [activeTab, setActiveTab] = useLocalStorage<WeatherTab>('let-it-rain:active-tab', 'overview')
  const { data, isLoading, isError, error } = useWeather(selectedLocation)
  const { canInstall, installed, install } = useInstallPrompt()

  const renderTabContent = () => {
    if (!data) return null

    const current = data.current
    const firstDay = data.daily.entries[0] ?? {}
    const firstHour = data.hourly.entries[0] ?? {}

    switch (activeTab) {
      case 'overview':
        return (
          <div key="overview" className="space-y-6">
            <SectionShell eyebrow="Overview" title="Current atmosphere" description="The essentials, gathered into one calm view.">
              <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
                <div className="rounded-[32px] border border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-transparent p-6 shadow-glass backdrop-blur-xl">
                  <div className="text-xs uppercase tracking-[0.35em] text-stone-500">Headline</div>
                  <div className="mt-4 text-4xl font-semibold text-white">{weatherCodeLabel(Number(current.weather_code))}</div>
                  <div className="mt-3 max-w-xl text-stone-300">
                    Feels like {Number(current.apparent_temperature)}{data.current_units.apparent_temperature} with humidity at{' '}
                    {Number(current.relative_humidity_2m)}{data.current_units.relative_humidity_2m}.
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-2">
                  <MetricCard label="Feels like" value={Number(current.apparent_temperature)} unit={data.current_units.apparent_temperature} />
                  <MetricCard label="Humidity" value={Number(current.relative_humidity_2m)} unit={data.current_units.relative_humidity_2m} />
                  <MetricCard label="Condition" value={weatherCodeLabel(Number(current.weather_code))} />
                  <MetricCard label="Day phase" value={Number(current.is_day) === 1 ? 'Daylight' : 'Night'} />
                </div>
              </div>
            </SectionShell>
            <div className="grid gap-4 xl:grid-cols-[1fr_320px]">
              <HourlyStrip weather={data} />
              <div className="space-y-4">
                <div className="rounded-[28px] border border-white/10 bg-white/6 p-5 shadow-glass backdrop-blur-xl">
                  <div className="flex items-center gap-2 text-sm uppercase tracking-[0.35em] text-stone-500">
                    <Layers3 className="h-4 w-4" />
                    At a glance
                  </div>
                  <div className="mt-4 space-y-3 text-sm text-stone-300">
                    <div>Updated {formatDateTime(data.status.generated_at)}</div>
                    <div>{data.location.timezone ?? 'Local time'} timezone</div>
                    <div>{data.daily.entries.length} day outlook</div>
                    <div>{data.hourly.entries.slice(0, 24).length} hour detail</div>
                  </div>
                </div>
                <div className="rounded-[28px] border border-white/10 bg-gradient-to-br from-amber-300/12 to-transparent p-5 shadow-glass backdrop-blur-xl">
                  <div className="flex items-center gap-2 text-sm uppercase tracking-[0.35em] text-stone-500">
                    <Compass className="h-4 w-4" />
                    Location
                  </div>
                  <div className="mt-4 text-sm leading-7 text-stone-300">
                    {[data.location.name, data.location.admin, data.location.country].filter(Boolean).join(', ')}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      case 'hourly':
        return (
          <div key="hourly" className="space-y-6">
            <SectionShell eyebrow="Hourly" title="Next 24 hours" description="A closer look at how the day unfolds.">
              <HourlyStrip weather={data} />
            </SectionShell>
            <div className="grid gap-4 xl:grid-cols-[0.85fr_1.15fr]">
              <div className="rounded-[28px] border border-white/10 bg-white/6 p-5 shadow-glass backdrop-blur-xl">
                <div className="text-xs uppercase tracking-[0.35em] text-stone-500">Tempo</div>
                <div className="mt-4 space-y-4">
                  {data.hourly.entries.slice(0, 6).map((entry) => (
                    <div key={`tempo-${String(entry.time)}`} className="grid grid-cols-[72px_1fr_auto] items-center gap-3">
                      <div className="text-sm text-stone-400">{String(entry.time).slice(11, 16)}</div>
                      <div className="h-2 rounded-full bg-white/8">
                        <div
                          className="h-2 rounded-full bg-gradient-to-r from-sky-300/70 via-white/70 to-amber-300/60"
                          style={{ width: `${Math.max(14, Math.min(Number(entry.precipitation_probability) || 0, 100))}%` }}
                        />
                      </div>
                      <div className="text-sm text-stone-300">
                        {Number(entry.temperature_2m)}{data.hourly.units.temperature_2m}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <MetricCard label="Temperature" value={Number(firstHour.temperature_2m)} unit={data.hourly.units.temperature_2m} />
                <MetricCard label="Apparent temperature" value={Number(firstHour.apparent_temperature)} unit={data.hourly.units.apparent_temperature} />
                <MetricCard label="Wind speed" value={Number(firstHour.wind_speed_10m)} unit={data.hourly.units.wind_speed_10m} />
                <MetricCard label="Precipitation chance" value={Number(firstHour.precipitation_probability)} unit={data.hourly.units.precipitation_probability} />
              </div>
            </div>
          </div>
        )
      case 'daily':
        return (
          <div key="daily" className="space-y-6">
            <SectionShell eyebrow="Daily forecast" title="Long-range outlook" description="A clean view of the days ahead.">
              <DailyForecastGrid weather={data} />
            </SectionShell>
          </div>
        )
      case 'precipitation':
        return (
          <div key="precipitation" className="space-y-6">
            <SectionShell eyebrow="Precipitation" title="Rain, showers, snow, and chance" description="Everything falling from the sky, in one place.">
              <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
                <div className="rounded-[28px] border border-white/10 bg-white/6 p-5 shadow-glass backdrop-blur-xl">
                  <div className="flex items-center gap-2 text-sm uppercase tracking-[0.35em] text-stone-500">
                    <CloudRain className="h-4 w-4" />
                    Distribution
                  </div>
                  <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {data.hourly.entries.slice(0, 8).map((entry) => (
                      <div key={`rain-${String(entry.time)}`} className="rounded-[22px] border border-white/8 bg-black/20 p-4">
                        <div className="text-sm text-stone-400">{String(entry.time).slice(11, 16)}</div>
                        <div className="mt-4 h-28 rounded-[20px] bg-gradient-to-t from-sky-400/10 via-white/5 to-transparent p-2">
                          <div
                            className="ml-auto mr-auto h-full w-6 rounded-full bg-gradient-to-t from-sky-300/75 to-white/40"
                            style={{
                              transform: `scaleY(${0.28 + Math.min(Number(entry.precipitation_probability) || 0, 100) / 100})`,
                              transformOrigin: 'bottom',
                            }}
                          />
                        </div>
                        <div className="mt-3 text-sm text-stone-300">
                          {Number(entry.precipitation_probability) || 0}
                          {data.hourly.units.precipitation_probability}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-2">
                  <MetricCard label="Precipitation" value={Number(firstHour.precipitation)} unit={data.hourly.units.precipitation} />
                  <MetricCard label="Rain" value={Number(firstHour.rain)} unit={data.hourly.units.rain} />
                  <MetricCard label="Showers" value={Number(firstHour.showers)} unit={data.hourly.units.showers} />
                  <MetricCard label="Snowfall" value={Number(firstHour.snowfall)} unit={data.hourly.units.snowfall} />
                  <MetricCard label="Precipitation probability" value={Number(firstHour.precipitation_probability)} unit={data.hourly.units.precipitation_probability} />
                </div>
              </div>
            </SectionShell>
          </div>
        )
      case 'wind':
        return (
          <div key="wind" className="space-y-6">
            <SectionShell eyebrow="Wind & pressure" title="Movement and pressure systems" description="A clearer read on the air around you.">
              <div className="grid gap-4 xl:grid-cols-[0.8fr_1.2fr]">
                <div className="rounded-[28px] border border-white/10 bg-white/6 p-6 shadow-glass backdrop-blur-xl">
                  <div className="flex items-center gap-2 text-sm uppercase tracking-[0.35em] text-stone-500">
                    <Wind className="h-4 w-4" />
                    Bearing
                  </div>
                  <div className="mt-6 flex h-56 items-center justify-center rounded-full border border-white/10 bg-black/25">
                    <div className="flex h-36 w-36 items-center justify-center rounded-full border border-white/10 bg-gradient-to-br from-white/10 to-transparent text-center">
                      <div>
                        <div className="text-xs uppercase tracking-[0.3em] text-stone-500">Direction</div>
                        <div className="mt-3 text-4xl text-white">{formatCompassDirection(Number(current.wind_direction_10m))}</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
                  <MetricCard label="Wind speed" value={Number(current.wind_speed_10m)} unit={data.current_units.wind_speed_10m} />
                  <MetricCard label="Wind direction" value={formatCompassDirection(Number(current.wind_direction_10m))} />
                  <MetricCard label="Wind gusts" value={Number(current.wind_gusts_10m)} unit={data.current_units.wind_gusts_10m} />
                  <MetricCard label="Surface pressure" value={Number(current.surface_pressure)} unit={data.current_units.surface_pressure} />
                  <MetricCard label="Sea level pressure" value={Number(current.pressure_msl)} unit={data.current_units.pressure_msl} />
                </div>
              </div>
            </SectionShell>
          </div>
        )
      case 'sky':
        return (
          <div key="sky" className="space-y-6">
            <SectionShell eyebrow="Sky & visibility" title="Cloud layers and clarity" description="How open the sky feels, from low cloud to long visibility.">
              <div className="grid gap-4 xl:grid-cols-[1fr_320px]">
                <div className="rounded-[28px] border border-white/10 bg-white/6 p-5 shadow-glass backdrop-blur-xl">
                  <div className="flex items-center gap-2 text-sm uppercase tracking-[0.35em] text-stone-500">
                    <Eye className="h-4 w-4" />
                    Layers
                  </div>
                  <div className="mt-5 space-y-4">
                    {[
                      { label: 'Low cloud', value: Number(firstHour.cloud_cover_low), unit: data.hourly.units.cloud_cover_low },
                      { label: 'Mid cloud', value: Number(firstHour.cloud_cover_mid), unit: data.hourly.units.cloud_cover_mid },
                      { label: 'High cloud', value: Number(firstHour.cloud_cover_high), unit: data.hourly.units.cloud_cover_high },
                    ].map((layer) => (
                      <div key={layer.label}>
                        <div className="mb-2 flex items-center justify-between text-sm text-stone-300">
                          <span>{layer.label}</span>
                          <span>{layer.value}{layer.unit}</span>
                        </div>
                        <div className="h-3 rounded-full bg-white/8">
                          <div
                            className="h-3 rounded-full bg-gradient-to-r from-white/20 via-sky-200/60 to-white/75"
                            style={{ width: `${Math.max(8, Math.min(layer.value || 0, 100))}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="grid gap-4">
                  <MetricCard label="Cloud cover" value={Number(firstHour.cloud_cover)} unit={data.hourly.units.cloud_cover} />
                  <MetricCard label="Visibility" value={Number(firstHour.visibility)} unit={data.hourly.units.visibility} />
                </div>
              </div>
            </SectionShell>
          </div>
        )
      case 'sun':
        return (
          <div key="sun" className="space-y-6">
            <SectionShell eyebrow="Sun & radiation" title="Light conditions" description="A snapshot of brightness, UV, and the rhythm of the day.">
              <div className="grid gap-4 xl:grid-cols-[1fr_1fr]">
                <div className="rounded-[28px] border border-amber-300/10 bg-gradient-to-br from-amber-300/10 via-white/5 to-transparent p-5 shadow-glass backdrop-blur-xl">
                  <div className="flex items-center gap-2 text-sm uppercase tracking-[0.35em] text-stone-500">
                    <SunMedium className="h-4 w-4 text-amber-200" />
                    Solar profile
                  </div>
                  <div className="mt-5 grid gap-4 md:grid-cols-2">
                    <MetricCard label="UV index" value={Number(firstHour.uv_index)} unit={data.hourly.units.uv_index} />
                    <MetricCard label="Sunshine duration" value={Number(firstHour.sunshine_duration)} unit={data.hourly.units.sunshine_duration} />
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <MetricCard label="Direct radiation" value={Number(firstHour.direct_radiation)} unit={data.hourly.units.direct_radiation} />
                  <MetricCard label="Diffuse radiation" value={Number(firstHour.diffuse_radiation)} unit={data.hourly.units.diffuse_radiation} />
                </div>
              </div>
            </SectionShell>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-[28px] border border-white/10 bg-white/6 p-5 shadow-glass backdrop-blur-xl">
                <div className="flex items-center gap-2 text-sm uppercase tracking-[0.35em] text-stone-500">
                  <Sunrise className="h-4 w-4" />
                  Sunrise
                </div>
                <div className="mt-3 text-3xl text-white">{firstDay.sunrise ? formatDateTime(String(firstDay.sunrise)) : 'Unavailable'}</div>
              </div>
              <div className="rounded-[28px] border border-white/10 bg-white/6 p-5 shadow-glass backdrop-blur-xl">
                <div className="flex items-center gap-2 text-sm uppercase tracking-[0.35em] text-stone-500">
                  <Sunset className="h-4 w-4" />
                  Sunset
                </div>
                <div className="mt-3 text-3xl text-white">{firstDay.sunset ? formatDateTime(String(firstDay.sunset)) : 'Unavailable'}</div>
              </div>
            </div>
          </div>
        )
      case 'ground':
        return (
          <div key="ground" className="space-y-6">
            <SectionShell eyebrow="Ground & soil" title="Surface response" description="A quieter layer of the forecast, close to the ground.">
              <div className="grid gap-4 xl:grid-cols-[1fr_1fr]">
                <div className="rounded-[28px] border border-white/10 bg-gradient-to-br from-emerald-300/10 via-white/5 to-transparent p-6 shadow-glass backdrop-blur-xl">
                  <div className="flex items-center gap-2 text-sm uppercase tracking-[0.35em] text-stone-500">
                    <Sprout className="h-4 w-4 text-emerald-200" />
                    Soil profile
                  </div>
                  <div className="mt-6">
                    <MetricCard label="Soil temperature" value={Number(firstHour.soil_temperature_0cm)} unit={data.hourly.units.soil_temperature_0cm} />
                  </div>
                </div>
                <div className="rounded-[28px] border border-white/10 bg-gradient-to-br from-amber-300/10 via-white/5 to-transparent p-6 shadow-glass backdrop-blur-xl">
                  <div className="flex items-center gap-2 text-sm uppercase tracking-[0.35em] text-stone-500">
                    <Gauge className="h-4 w-4 text-amber-200" />
                    Surface balance
                  </div>
                  <div className="mt-6">
                    <MetricCard label="Soil moisture" value={Number(firstHour.soil_moisture_0_to_1cm)} unit={data.hourly.units.soil_moisture_0_to_1cm} />
                  </div>
                </div>
              </div>
            </SectionShell>
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen bg-ink text-white">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_top,rgba(245,158,11,0.12),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(251,146,60,0.1),transparent_22%)]" />
      <div className="fixed inset-y-0 left-[14%] hidden w-px bg-white/5 xl:block" />
      <div className="fixed inset-y-0 right-[16%] hidden w-px bg-white/5 xl:block" />

      <main className="relative mx-auto flex min-h-screen max-w-7xl flex-col gap-8 px-4 pb-24 pt-6 md:px-6 lg:px-8">
        <header className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr_0.9fr] xl:items-start">
          <div className="hidden xl:block">
            <BrandLogo />
            <p className="mt-8 max-w-xs text-stone-500">A cinematic forecast for cities, coastlines, and everywhere in between.</p>
          </div>
          <div className="space-y-6">
            <BrandLogo compact className="xl:hidden" />
            <SearchCombobox initialValue={selectedLocation ? [selectedLocation.name, selectedLocation.admin, selectedLocation.country].filter(Boolean).join(', ') : ''} onSelect={setSelectedLocation} />
            <div className="flex flex-wrap items-center gap-3">
              <InstallAppButton canInstall={canInstall} installed={installed} onInstall={install} />
              <div className="rounded-full border border-white/10 bg-white/6 px-4 py-3 text-sm text-stone-300">Save the forecast to your desktop.</div>
            </div>
          </div>
          <div className="hidden xl:flex xl:justify-end">
            <div className="max-w-sm text-right">
              <div className="font-display text-5xl leading-none text-white">Follow the weather, beautifully.</div>
              <p className="mt-8 text-stone-500">From first light to late evening, keep the whole forecast close.</p>
            </div>
          </div>
        </header>

        {isLoading ? <WeatherSkeleton /> : null}
        {!isLoading && isError ? <div className="rounded-[32px] border border-red-500/20 bg-red-500/10 p-6 text-red-100"><div className="flex items-start gap-3"><AlertTriangle className="mt-1 h-5 w-5" /><div><div className="text-lg font-medium">The forecast could not load.</div><div className="mt-2 text-sm text-red-100/80">{error instanceof Error ? error.message : 'Please try again in a moment.'}</div></div></div></div> : null}
        {!isLoading && !data ? <EmptyState /> : null}

        {data ? (
          <>
            <HeroPanel weather={data} />
            <TabNav activeTab={activeTab} onChange={setActiveTab} />
            {renderTabContent()}
          </>
        ) : null}
      </main>
    </div>
  )
}

export default App
