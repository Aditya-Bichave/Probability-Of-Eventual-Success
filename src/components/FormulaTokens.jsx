import { formulaNodeMap } from '../content/formulaGraph'
import { cn, getNodeTheme } from '../lib/ui'

const containerByVariant = {
  chips: 'flex flex-wrap items-center gap-2 rounded-3xl border border-white/10 bg-black/15 p-4 text-sm text-white/70',
  formula:
    'flex min-w-0 w-full flex-wrap items-center gap-x-2 gap-y-3 rounded-[30px] border border-white/10 bg-black/20 p-5 text-white/86 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]',
}

const textByVariant = {
  chips: 'font-mono text-[0.78rem] leading-6 text-white/58 sm:text-sm',
  formula: 'min-w-0 break-words font-display text-base leading-8 text-white/72 sm:text-lg',
}

const buttonByVariant = {
  chips: 'inline-flex min-h-10 items-center rounded-full border px-3 py-1.5 text-sm font-semibold transition-all duration-300 hover:-translate-y-0.5',
  formula:
    'inline-flex max-w-full items-center rounded-2xl border px-3 py-1.5 font-display text-base leading-8 tracking-tight transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/8 sm:text-lg',
}

export function FormulaTokens({ segments, activeId, onSelect, variant = 'chips', className = '' }) {
  if (!segments?.length) return null

  return (
    <div className={cn(containerByVariant[variant] ?? containerByVariant.chips, className)}>
      {segments.map((segment, index) => {
        if (segment.type === 'text') {
          return (
            <span key={`${segment.value}-${index}`} className={textByVariant[variant] ?? textByVariant.chips}>
              {segment.value}
            </span>
          )
        }

        const targetNode = formulaNodeMap[segment.id]
        const theme = getNodeTheme(targetNode)
        const isActive = activeId === segment.id

        return (
          <button
            key={segment.id + index}
            type="button"
            onClick={() => onSelect(segment.id)}
            className={cn(
              buttonByVariant[variant] ?? buttonByVariant.chips,
              theme.pill,
              isActive && 'ring-1 ring-white/60 shadow-[0_0_0_1px_rgba(255,255,255,0.28)]',
            )}
          >
            {segment.label}
          </button>
        )
      })}
    </div>
  )
}