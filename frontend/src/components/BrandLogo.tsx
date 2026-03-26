import clsx from 'clsx'

export function BrandLogo({
  compact = false,
  className,
}: {
  compact?: boolean
  className?: string
}) {
  return (
    <div className={clsx('flex items-center gap-3', className)}>
      <img
        src="/let-it-rain-mark.svg"
        alt="Let it rain"
        className={clsx(compact ? 'h-10 w-10' : 'h-12 w-12')}
      />
      <div>
        <div className={clsx('font-display leading-none text-white', compact ? 'text-xl' : 'text-2xl')}>
          Let it rain
        </div>
        <div className="mt-1 text-xs uppercase tracking-[0.35em] text-stone-500">
          Atmospheric forecast
        </div>
      </div>
    </div>
  )
}
