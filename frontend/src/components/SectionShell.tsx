import type { ReactNode } from 'react'

export function SectionShell({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string
  title: string
  description: string
  children: ReactNode
}) {
  return (
    <section className="space-y-5">
      <div>
        <div className="text-xs uppercase tracking-[0.35em] text-stone-500">{eyebrow}</div>
        <div className="mt-2 text-2xl font-semibold text-white">{title}</div>
        <p className="mt-2 max-w-2xl text-stone-400">{description}</p>
      </div>
      {children}
    </section>
  )
}
