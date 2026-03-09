import { BlockMath } from 'react-katex'
import * as ScrollArea from '@radix-ui/react-scroll-area'
import { ExternalLink } from 'lucide-react'
import { defaultNodeId, formulaNodeMap, researchSources } from '../content/formulaGraph'
import { cn, findPathToNode, getNodeTheme } from '../lib/ui'
import { FormulaTokens } from './FormulaTokens'

function AuxiliaryFormula({ formula, nodeId, onSelect }) {
  return (
    <div className="rounded-[24px] border border-white/10 bg-white/[0.04] p-4">
      <div className="text-xs uppercase tracking-[0.24em] text-white/42">{formula.label || 'Auxiliary formula'}</div>
      {formula.segments?.length ? <FormulaTokens segments={formula.segments} activeId={nodeId} onSelect={onSelect} variant="formula" className="mt-3" /> : null}
      <div className="mt-3 rounded-[20px] border border-white/8 bg-black/15 p-4">
        <BlockMath math={formula.math} />
      </div>
    </div>
  )
}

export function InspectorPanel({ nodeId, onSelect, className = '', sticky = true, scrollHeightClass = 'h-[min(42rem,calc(100vh-9rem))]' }) {
  const node = formulaNodeMap[nodeId] ?? formulaNodeMap[defaultNodeId]
  const path = findPathToNode(nodeId) ?? [defaultNodeId, nodeId]
  const theme = getNodeTheme(node)

  return (
    <div className={cn('glass-panel overflow-hidden', sticky && 'sticky top-28', className)}>
      <div className={cn('absolute inset-x-0 top-0 h-28 bg-gradient-to-br', theme.glow)} />
      <ScrollArea.Root className={cn('overflow-hidden', scrollHeightClass)}>
        <ScrollArea.Viewport className="h-full px-6 pt-6 pb-10">
          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.22em] text-white/45">
              {path.map((pathId, index) => (
                <div key={pathId} className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onSelect(pathId)}
                    className="rounded-full border border-white/10 px-2 py-1 transition hover:bg-white/8 hover:text-white"
                  >
                    {formulaNodeMap[pathId]?.title ?? pathId}
                  </button>
                  {index < path.length - 1 ? <span>/</span> : null}
                </div>
              ))}
            </div>

            <div className="space-y-3">
              <span className={cn('inline-flex rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em]', theme.pill)}>
                {node.category}
              </span>
              <h3 className="font-display text-2xl text-white">{node.title}</h3>
              <p className="text-sm leading-7 text-white/68">{node.description}</p>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-black/15 p-5">
              {node.formulaSegments?.length ? (
                <FormulaTokens segments={node.formulaSegments} activeId={nodeId} onSelect={onSelect} variant="formula" />
              ) : (
                <div className="inline-flex rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-2 font-display text-xl text-white/90">{node.symbol}</div>
              )}
              {node.displayFormula ? (
                <div className="mt-4 rounded-[20px] border border-white/8 bg-white/[0.03] p-4">
                  <BlockMath math={node.displayFormula} />
                </div>
              ) : null}
            </div>

            {node.extraFormulas?.length ? (
              <div className="space-y-3">
                <div className="text-xs uppercase tracking-[0.24em] text-white/42">Auxiliary formulas</div>
                <div className="space-y-3">
                  {node.extraFormulas.map((formula) => (
                    <AuxiliaryFormula key={`${node.id}-${formula.math}`} formula={formula} nodeId={nodeId} onSelect={onSelect} />
                  ))}
                </div>
              </div>
            ) : null}

            <div className="grid gap-4 rounded-[28px] border border-white/10 bg-white/[0.03] p-5 sm:grid-cols-2">
              <div>
                <div className="text-xs uppercase tracking-[0.24em] text-white/42">Range</div>
                <div className="mt-2 text-sm text-white/78">{node.range}</div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-[0.24em] text-white/42">Intuition</div>
                <div className="mt-2 text-sm text-white/78">{node.intuition}</div>
              </div>
            </div>

            {node.examples?.length ? (
              <div className="space-y-3">
                <div className="text-xs uppercase tracking-[0.24em] text-white/42">Examples</div>
                <div className="grid gap-3">
                  {node.examples.map((example) => (
                    <div key={example} className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm leading-7 text-white/72">
                      {example}
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {node.children?.length ? (
              <div className="space-y-3">
                <div className="text-xs uppercase tracking-[0.24em] text-white/42">Internal factors</div>
                <div className="flex flex-wrap gap-2">
                  {node.children.map((childId) => {
                    const childNode = formulaNodeMap[childId]
                    const childTheme = getNodeTheme(childNode)
                    return (
                      <button
                        key={childId}
                        type="button"
                        onClick={() => onSelect(childId)}
                        className={cn('inline-flex items-center rounded-full border px-3 py-2 text-sm transition hover:-translate-y-0.5', childTheme.pill)}
                      >
                        {childNode.title}
                      </button>
                    )
                  })}
                </div>
              </div>
            ) : null}

            {node.related?.length ? (
              <div className="space-y-3">
                <div className="text-xs uppercase tracking-[0.24em] text-white/42">Related variables</div>
                <div className="flex flex-wrap gap-2">
                  {node.related.map((relatedId) => {
                    const relatedNode = formulaNodeMap[relatedId]
                    if (!relatedNode) return null

                    return (
                      <button key={relatedId} type="button" onClick={() => onSelect(relatedId)} className="glass-chip text-sm text-white/72">
                        {relatedNode.title}
                      </button>
                    )
                  })}
                </div>
              </div>
            ) : null}

            {node.references?.length ? (
              <div className="space-y-3">
                <div className="text-xs uppercase tracking-[0.24em] text-white/42">Research links</div>
                <div className="space-y-3">
                  {node.references.map((referenceId) => {
                    const source = researchSources.find((item) => item.id === referenceId)
                    if (!source) return null

                    return (
                      <a
                        key={referenceId}
                        href={source.href}
                        target="_blank"
                        rel="noreferrer"
                        className="block rounded-2xl border border-white/10 bg-white/[0.04] p-4 transition hover:bg-white/[0.07]"
                      >
                        <div className="flex items-center justify-between gap-4">
                          <div>
                            <div className="text-xs uppercase tracking-[0.24em] text-white/42">{source.host}</div>
                            <div className="mt-1 text-sm text-white/80">{source.title}</div>
                          </div>
                          <ExternalLink className="h-4 w-4 text-white/40" />
                        </div>
                      </a>
                    )
                  })}
                </div>
              </div>
            ) : null}
          </div>
        </ScrollArea.Viewport>
        <ScrollArea.Scrollbar className="flex touch-none select-none p-1" orientation="vertical">
          <ScrollArea.Thumb className="relative flex-1 rounded-full bg-white/20" />
        </ScrollArea.Scrollbar>
      </ScrollArea.Root>
    </div>
  )
}