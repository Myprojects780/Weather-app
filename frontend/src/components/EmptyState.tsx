import { Search } from 'lucide-react'

export function EmptyState() {
  return (
    <div className="rounded-[36px] border border-dashed border-white/10 bg-white/4 p-10 text-center shadow-glass backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-300/10 text-amber-200">
        <Search className="h-7 w-7" />
      </div>
      <div className="mt-6 text-2xl text-white">Find a place to begin</div>
      <p className="mx-auto mt-3 max-w-xl text-stone-400">
        Detailed forecasts, atmospheric conditions, and daily outlooks in one place.
      </p>
    </div>
  )
}
