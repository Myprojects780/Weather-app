import { formatValue } from '../lib/format'

interface MetricCardProps {
  label: string
  value: number | string | null | undefined
  unit?: string
}

export function MetricCard({ label, value, unit }: MetricCardProps) {
  return (
    <div className="rounded-[24px] border border-white/10 bg-white/6 p-5 shadow-glass backdrop-blur-xl">
      <div className="text-sm text-stone-400">{label}</div>
      <div className="mt-3 text-2xl font-semibold text-white">{formatValue(value, unit)}</div>
    </div>
  )
}
