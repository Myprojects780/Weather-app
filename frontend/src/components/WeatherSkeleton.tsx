export function WeatherSkeleton() {
  return (
    <div className="space-y-6">
      <div className="h-[420px] animate-pulse rounded-[36px] bg-white/6" />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="h-36 animate-pulse rounded-[28px] bg-white/6" />
        ))}
      </div>
    </div>
  )
}
