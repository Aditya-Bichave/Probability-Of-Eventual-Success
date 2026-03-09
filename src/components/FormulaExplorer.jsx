import { useState } from 'react'
import { motion as Motion } from 'motion/react'
import { BlockMath } from 'react-katex'
import * as Dialog from '@radix-ui/react-dialog'
import { ArrowLeft, Orbit, X } from 'lucide-react'
import { defaultNodeId, formulaNodeMap } from '../content/formulaGraph'
import { cn, findPathToNode, getNodeTheme } from '../lib/ui'
import { FormulaTokens } from './FormulaTokens'
import { InspectorPanel } from './InspectorPanel'
import { SectionHeader } from './SectionHeader'

function FormulaSurface({ node, activeId, onSelect, label }) {
  return (
    <div className="space-y-4 rounded-[30px] border border-white/10 bg-black/15 p-5">
      <div className="flex items-center justify-between gap-3">
        <div className="text-xs uppercase tracking-[0.24em] text-white/42">{label}</div>
        <div className="text-xs text-white/46">click the actual formula to drill down</div>
      </div>
      {node.formulaSegments?.length ? (
        <FormulaTokens segments={node.formulaSegments} activeId={activeId} onSelect={onSelect} variant="formula" />
      ) : (
        <div className="inline-flex rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-2 font-display text-xl text-white/90">{node.symbol}</div>
      )}
      {node.displayFormula ? (
        <div className="rounded-[24px] border border-white/8 bg-white/[0.03] p-4">
          <BlockMath math={node.displayFormula} />
        </div>
      ) : null}
    </div>
  )
}

function ExtraFormulaCard({ formula, activeId, onSelect }) {
  return (
    <div className="rounded-[26px] border border-white/10 bg-white/[0.04] p-5">
      <div className="flex items-center justify-between gap-3">
        <div className="text-xs uppercase tracking-[0.24em] text-white/42">{formula.label || 'Auxiliary formula'}</div>
        <div className="text-xs text-white/44">nested view</div>
      </div>
      {formula.segments?.length ? <FormulaTokens segments={formula.segments} activeId={activeId} onSelect={onSelect} variant="formula" className="mt-3" /> : null}
      <div className="mt-3 rounded-[22px] border border-white/8 bg-black/15 p-4">
        <BlockMath math={formula.math} />
      </div>
    </div>
  )
}

export function FormulaExplorer({ selectedNodeId, onSelect }) {
  const [sheetOpen, setSheetOpen] = useState(false)
  const selectedNode = formulaNodeMap[selectedNodeId] ?? formulaNodeMap[defaultNodeId]
  const selectedTheme = getNodeTheme(selectedNode)
  const selectedPath = findPathToNode(selectedNode.id) ?? [defaultNodeId, selectedNode.id]
  const parentNodeId = selectedPath.length > 1 ? selectedPath[selectedPath.length - 2] : null

  const openNode = (nodeId) => {
    onSelect(nodeId)
    if (typeof window !== 'undefined' && window.innerWidth < 1280) {
      setSheetOpen(true)
    }
  }

  return (
    <section id="explorer" className="section-shell mt-28 scroll-mt-28">
      <SectionHeader
        eyebrow="Formula Explorer"
        title="Click the formula itself, follow each nested variable, and inspect the research model from the inside out."
        body="Every node now exposes the precise symbolic form, the operational formulas used in the simulator, the plain-English meaning, and the internal factors that generate it."
        icon={Orbit}
      />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)]">
        <div className="space-y-6">
          <Motion.article
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.75 }}
            className="glass-panel relative overflow-hidden p-6 sm:p-8"
          >
            <div className="absolute inset-x-0 top-0 h-36 bg-gradient-to-br from-cyan-400/16 via-transparent to-fuchsia-400/12" />
            <div className="relative space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="text-xs uppercase tracking-[0.24em] text-white/42">Root equation</div>
                  <h3 className="mt-2 font-display text-2xl text-white sm:text-3xl">The full success system in one view</h3>
                </div>
                <div className="glass-chip text-white/72">includes the original limit intuition</div>
              </div>

              <FormulaSurface node={formulaNodeMap.success} activeId={selectedNodeId} onSelect={openNode} label="Interactive master formula" />

              <div className="grid gap-4 lg:grid-cols-2">
                {formulaNodeMap.success.extraFormulas?.map((formula) => (
                  <ExtraFormulaCard key={formula.math} formula={formula} activeId={selectedNodeId} onSelect={openNode} />
                ))}
              </div>
            </div>
          </Motion.article>

          <Motion.article
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.75, delay: 0.05 }}
            className="glass-panel relative overflow-hidden p-6 sm:p-8"
          >
            <div className={cn('absolute inset-x-0 top-0 h-36 bg-gradient-to-br', selectedTheme.glow)} />
            <div className="relative space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="space-y-3">
                  <span className={cn('inline-flex rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em]', selectedTheme.pill)}>
                    {selectedNode.symbol}
                  </span>
                  <div>
                    <h3 className="font-display text-3xl text-white">{selectedNode.title}</h3>
                    <p className="mt-3 max-w-3xl text-sm leading-7 text-white/68 sm:text-base">{selectedNode.description}</p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {parentNodeId ? (
                    <button type="button" onClick={() => openNode(parentNodeId)} className="glass-chip text-white/82">
                      <ArrowLeft className="h-4 w-4" />
                      Back one level
                    </button>
                  ) : null}
                  <button type="button" onClick={() => setSheetOpen(true)} className="glass-chip text-white xl:hidden">
                    Open inspector
                  </button>
                </div>
              </div>

              <FormulaSurface node={selectedNode} activeId={selectedNodeId} onSelect={openNode} label="Interactive node formula" />

              {selectedNode.extraFormulas?.length ? (
                <div className="space-y-4">
                  <div className="text-xs uppercase tracking-[0.24em] text-white/42">Auxiliary formulas</div>
                  <div className="grid gap-4 lg:grid-cols-2">
                    {selectedNode.extraFormulas.map((formula) => (
                      <ExtraFormulaCard key={`${selectedNode.id}-${formula.math}`} formula={formula} activeId={selectedNodeId} onSelect={openNode} />
                    ))}
                  </div>
                </div>
              ) : null}

              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5">
                  <div className="text-xs uppercase tracking-[0.24em] text-white/42">Range</div>
                  <div className="mt-3 text-sm text-white/82">{selectedNode.range}</div>
                </div>
                <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5 md:col-span-2">
                  <div className="text-xs uppercase tracking-[0.24em] text-white/42">Intuition</div>
                  <div className="mt-3 text-sm leading-7 text-white/76">{selectedNode.intuition}</div>
                </div>
              </div>

              {selectedNode.examples?.length ? (
                <div className="space-y-4">
                  <div className="text-xs uppercase tracking-[0.24em] text-white/42">Examples</div>
                  <div className="grid gap-3">
                    {selectedNode.examples.map((example) => (
                      <div key={example} className="rounded-[24px] border border-white/10 bg-white/[0.04] px-4 py-4 text-sm leading-7 text-white/74">
                        {example}
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

              {selectedNode.children?.length ? (
                <div className="space-y-4">
                  <div className="text-xs uppercase tracking-[0.24em] text-white/42">Internal factors</div>
                  <div className="grid gap-4 md:grid-cols-2">
                    {selectedNode.children.map((childId) => {
                      const childNode = formulaNodeMap[childId]
                      const childTheme = getNodeTheme(childNode)

                      return (
                        <button
                          key={childId}
                          type="button"
                          onClick={() => openNode(childId)}
                          className={cn('group relative overflow-hidden rounded-[28px] border bg-white/[0.04] p-5 text-left transition duration-300 hover:-translate-y-1 hover:bg-white/[0.06]', childTheme.edge)}
                        >
                          <div className={cn('absolute inset-x-0 top-0 h-28 bg-gradient-to-br opacity-80 transition group-hover:opacity-100', childTheme.glow)} />
                          <div className="relative">
                            <div className={cn('inline-flex rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em]', childTheme.pill)}>
                              {childNode.symbol}
                            </div>
                            <div className="mt-3 text-lg font-semibold text-white">{childNode.title}</div>
                            <p className="mt-2 text-sm leading-6 text-white/64">{childNode.description}</p>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </div>
              ) : null}

              {selectedNode.related?.length ? (
                <div className="space-y-3">
                  <div className="text-xs uppercase tracking-[0.24em] text-white/42">Related variables</div>
                  <div className="flex flex-wrap gap-2">
                    {selectedNode.related.map((relatedId) => {
                      const relatedNode = formulaNodeMap[relatedId]
                      if (!relatedNode) return null

                      return (
                        <button key={relatedId} type="button" onClick={() => openNode(relatedId)} className="glass-chip text-sm text-white/76">
                          {relatedNode.title}
                        </button>
                      )
                    })}
                  </div>
                </div>
              ) : null}
            </div>
          </Motion.article>

          <Motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.75, delay: 0.08 }}
            className="grid gap-4 md:grid-cols-3"
          >
            {[
              {
                title: 'Attempt happens',
                body: 'Consistency and resilience determine whether the planned attempt survives real life and becomes a real rep.',
              },
              {
                title: 'Attempt wins',
                body: 'Skill, strategy, timing, environment, network, and focus shape the success chance of that live attempt.',
              },
              {
                title: 'System improves',
                body: 'Feedback and adaptability update the system instead of letting repeated effort stagnate into repetition.',
              },
            ].map((card) => (
              <div key={card.title} className="glass-panel p-5">
                <div className="text-base font-semibold text-white">{card.title}</div>
                <p className="mt-3 text-sm leading-6 text-white/64">{card.body}</p>
              </div>
            ))}
          </Motion.div>
        </div>

        <div className="hidden xl:block">
          <InspectorPanel nodeId={selectedNodeId} onSelect={openNode} />
        </div>
      </div>

      <Dialog.Root open={sheetOpen} onOpenChange={setSheetOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xl xl:hidden" />
          <Dialog.Content className="fixed bottom-3 left-1/2 z-50 max-h-[88vh] w-[calc(100vw-1rem)] max-w-[46rem] -translate-x-1/2 overflow-hidden rounded-[34px] border border-white/12 bg-slate-950/94 p-2 shadow-[0_40px_120px_-30px_rgba(0,0,0,0.95)] xl:hidden">
            <div className="flex items-center justify-between px-4 py-3">
              <div>
                <Dialog.Title className="font-display text-xl text-white">Node inspector</Dialog.Title>
                <Dialog.Description className="text-sm text-white/58">Definitions, examples, formulas, and linked research</Dialog.Description>
              </div>
              <Dialog.Close asChild>
                <button type="button" className="glass-chip text-white/74">
                  <X className="h-4 w-4" />
                </button>
              </Dialog.Close>
            </div>
            <InspectorPanel nodeId={selectedNodeId} onSelect={openNode} sticky={false} scrollHeightClass="h-[calc(84vh-4rem)]" className="h-[calc(84vh-4rem)]" />
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </section>
  )
}