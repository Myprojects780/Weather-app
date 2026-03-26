import clsx from 'clsx'
import type { WeatherTab } from '../types'

interface TabNavProps {
  activeTab: WeatherTab
  onChange: (tab: WeatherTab) => void
}

const tabs: Array<{ id: WeatherTab; label: string }> = [
  { id: 'overview', label: 'Overview' },
  { id: 'hourly', label: 'Hourly' },
  { id: 'daily', label: 'Daily Forecast' },
  { id: 'precipitation', label: 'Precipitation' },
  { id: 'wind', label: 'Wind & Pressure' },
  { id: 'sky', label: 'Sky & Visibility' },
  { id: 'sun', label: 'Sun & Radiation' },
  { id: 'ground', label: 'Ground & Soil' },
]

export function TabNav({ activeTab, onChange }: TabNavProps) {
  return (
    <>
      <div className="hidden md:flex md:flex-wrap md:gap-3">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={clsx(
              'rounded-full px-4 py-2 text-sm transition',
              activeTab === tab.id
                ? 'bg-amber-300 text-stone-950'
                : 'border border-white/10 bg-white/6 text-stone-300 hover:bg-white/10',
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-stone-950/90 px-3 py-2 backdrop-blur-xl md:hidden">
        <div className="flex gap-2 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => onChange(tab.id)}
              className={clsx(
                'whitespace-nowrap rounded-full px-4 py-2 text-sm transition',
                activeTab === tab.id ? 'bg-amber-300 text-stone-950' : 'bg-white/6 text-stone-300',
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    </>
  )
}
