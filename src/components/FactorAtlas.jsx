import { motion as Motion } from 'motion/react'
import { BrainCircuit } from 'lucide-react'
import { atlasGroups, formulaNodeMap } from '../content/formulaGraph'
import { cn, getNodeTheme } from '../lib/ui'
import { SectionHeader } from './SectionHeader'

export function FactorAtlas({ onSelect }) {
  return (
    <section id="atlas" className="section-shell mt-28 scroll-mt-28">
      <SectionHeader
        eyebrow="Factor Atlas"
        title="Twelve core levers, grouped by the role they play in the curve."
        body="The model treats different variables differently. Some improve each attempt directly, some improve the system over time, and some determine whether attempts keep happening at all."
        icon={BrainCircuit}
      />

      <div className="space-y-8">
        {atlasGroups.map((group, groupIndex) => (
          <Motion.div
            key={group.title}
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.12 }}
            transition={{ duration: 0.72, delay: groupIndex * 0.04 }}
            className="space-y-4"
          >
            <div>
              <h3 className="font-display text-2xl text-white">{group.title}</h3>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-white/62">{group.description}</p>
            </div>
            <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
              {group.ids.map((nodeId) => {
                const node = formulaNodeMap[nodeId]
                const theme = getNodeTheme(node)

                return (
                  <button
                    key={nodeId}
                    type="button"
                    onClick={() => onSelect(nodeId, true)}
                    className={cn('group relative overflow-hidden rounded-[30px] border bg-white/[0.04] p-6 text-left transition duration-300 hover:-translate-y-1 hover:bg-white/[0.06]', theme.edge)}
                  >
                    <div className={cn('absolute inset-x-0 top-0 h-36 bg-gradient-to-br transition group-hover:opacity-100', theme.glow)} />
                    <div className="relative space-y-4">
                      <span className={cn('inline-flex rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em]', theme.pill)}>
                        {node.symbol}
                      </span>
                      <div>
                        <div className="text-xl font-semibold text-white">{node.title}</div>
                        <p className="mt-2 text-sm leading-6 text-white/64">{node.description}</p>
                      </div>
                      <div className="text-sm text-white/70">Open in explorer</div>
                    </div>
                  </button>
                )
              })}
            </div>
          </Motion.div>
        ))}
      </div>
    </section>
  )
}

