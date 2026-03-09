export function SectionHeader({ eyebrow, title, body, icon: Icon }) {
  return (
    <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div className="max-w-3xl space-y-3">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/7 px-3 py-1 text-xs uppercase tracking-[0.28em] text-white/70">
          {Icon ? <Icon className="h-3.5 w-3.5 text-cyan-200" /> : null}
          <span>{eyebrow}</span>
        </div>
        <h2 className="max-w-3xl font-display text-3xl tracking-tight text-white sm:text-4xl lg:text-5xl">
          {title}
        </h2>
      </div>
      <p className="max-w-2xl text-sm leading-7 text-white/68 sm:text-base">{body}</p>
    </div>
  )
}
