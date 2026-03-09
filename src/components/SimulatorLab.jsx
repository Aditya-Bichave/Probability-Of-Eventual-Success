import { startTransition, useDeferredValue, useEffect, useState } from 'react'
import * as Tabs from '@radix-ui/react-tabs'
import * as Tooltip from '@radix-ui/react-tooltip'
import { motion as Motion } from 'motion/react'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { FlaskConical, Target, TrendingUp } from 'lucide-react'
import { formulaNodeMap, simulatorPresets } from '../content/formulaGraph'
import { computeSuccessCurve, describeOutcome, formatPercent } from '../lib/modelEngine'
import { SectionHeader } from './SectionHeader'

const sliderGroups = {
  core: [
    { key: 'n', label: 'Planned attempts', min: 1, max: 10000, step: 1, formatter: (value) => `${Math.round(value)}` },
    { key: 'p0', label: 'Base probability p0', min: 0, max: 1, step: 0.001, formatter: (value) => formatPercent(value, 1), nodeId: 'baseChance' },
    { key: 'S0', label: 'Starting skill S0', min: 0, max: 1, step: 0.005, formatter: (value) => formatPercent(value, 1), nodeId: 'skill' },
    { key: 'timingBase', label: 'Timing baseline T0', min: 0, max: 1, step: 0.005, formatter: (value) => formatPercent(value, 1), nodeId: 'timingBase' },
    { key: 'timingTrend', label: 'Timing trend m', min: -1, max: 1, step: 0.01, formatter: (value) => `${value >= 0 ? '+' : ''}${value.toFixed(2)}`, nodeId: 'timingTrend' },
    { key: 'timingSwing', label: 'Timing swing s', min: 0, max: 1, step: 0.005, formatter: (value) => value.toFixed(3).replace(/0+$/, '').replace(/\.$/, ''), nodeId: 'timingSwing' },
  ],
  strategy: [
    { key: 'goalClarity', label: 'Goal clarity', min: 0, max: 1, step: 0.005, formatter: (value) => formatPercent(value, 1), nodeId: 'goalClarity' },
    { key: 'targetFit', label: 'Target fit', min: 0, max: 1, step: 0.005, formatter: (value) => formatPercent(value, 1), nodeId: 'targetFit' },
    { key: 'planQuality', label: 'Plan quality', min: 0, max: 1, step: 0.005, formatter: (value) => formatPercent(value, 1), nodeId: 'planQuality' },
    { key: 'learningBalance', label: 'Learn balance', min: 0, max: 1, step: 0.005, formatter: (value) => formatPercent(value, 1), nodeId: 'learningBalance' },
  ],
  persistence: [
    { key: 'adherenceRate', label: 'Adherence rate', min: 0, max: 1, step: 0.005, formatter: (value) => formatPercent(value, 1), nodeId: 'adherenceRate' },
    { key: 'spacingQuality', label: 'Spacing quality', min: 0, max: 1, step: 0.005, formatter: (value) => formatPercent(value, 1), nodeId: 'spacingQuality' },
    { key: 'recovery', label: 'Recovery', min: 0, max: 1, step: 0.005, formatter: (value) => formatPercent(value, 1), nodeId: 'recovery' },
    { key: 'regulation', label: 'Regulation', min: 0, max: 1, step: 0.005, formatter: (value) => formatPercent(value, 1), nodeId: 'regulation' },
    { key: 'stressTolerance', label: 'Stress tolerance', min: 0, max: 1, step: 0.005, formatter: (value) => formatPercent(value, 1), nodeId: 'stressTolerance' },
  ],
  environment: [
    { key: 'control', label: 'Control', min: 0, max: 1, step: 0.005, formatter: (value) => formatPercent(value, 1), nodeId: 'control' },
    { key: 'support', label: 'Support', min: 0, max: 1, step: 0.005, formatter: (value) => formatPercent(value, 1), nodeId: 'support' },
    { key: 'tools', label: 'Tools', min: 0, max: 1, step: 0.005, formatter: (value) => formatPercent(value, 1), nodeId: 'tools' },
    { key: 'timeResource', label: 'Time resource', min: 0, max: 1, step: 0.005, formatter: (value) => formatPercent(value, 1), nodeId: 'timeResource' },
    { key: 'runway', label: 'Runway', min: 0, max: 1, step: 0.005, formatter: (value) => formatPercent(value, 1), nodeId: 'runway' },
  ],
  network: [
    { key: 'relevance', label: 'Relevance', min: 0, max: 1, step: 0.005, formatter: (value) => formatPercent(value, 1), nodeId: 'relevance' },
    { key: 'trust', label: 'Trust', min: 0, max: 1, step: 0.005, formatter: (value) => formatPercent(value, 1), nodeId: 'trust' },
    { key: 'reach', label: 'Reach', min: 0, max: 1, step: 0.005, formatter: (value) => formatPercent(value, 1), nodeId: 'reach' },
    { key: 'activation', label: 'Activation', min: 0, max: 1, step: 0.005, formatter: (value) => formatPercent(value, 1), nodeId: 'activation' },
    { key: 'sponsorship', label: 'Sponsorship', min: 0, max: 1, step: 0.005, formatter: (value) => formatPercent(value, 1), nodeId: 'sponsorship' },
  ],
  learning: [
    { key: 'deepWork', label: 'Deep work', min: 0, max: 1, step: 0.005, formatter: (value) => formatPercent(value, 1), nodeId: 'deepWork' },
    { key: 'switchCost', label: 'Switch cost', min: 0, max: 1, step: 0.005, formatter: (value) => formatPercent(value, 1), nodeId: 'switchCost' },
    { key: 'feedbackQuality', label: 'Feedback quality', min: 0, max: 1, step: 0.005, formatter: (value) => formatPercent(value, 1), nodeId: 'feedbackQuality' },
    { key: 'receptivity', label: 'Receptivity', min: 0, max: 1, step: 0.005, formatter: (value) => formatPercent(value, 1), nodeId: 'receptivity' },
    { key: 'taskFocus', label: 'Task focus', min: 0, max: 1, step: 0.005, formatter: (value) => formatPercent(value, 1), nodeId: 'taskFocus' },
    { key: 'cognitiveFlex', label: 'Cognitive flex', min: 0, max: 1, step: 0.005, formatter: (value) => formatPercent(value, 1), nodeId: 'cognitiveFlex' },
    { key: 'learningOrientation', label: 'Learning orientation', min: 0, max: 1, step: 0.005, formatter: (value) => formatPercent(value, 1), nodeId: 'learningOrientation' },
    { key: 'updateSpeed', label: 'Update speed', min: 0, max: 1, step: 0.005, formatter: (value) => formatPercent(value, 1), nodeId: 'updateSpeed' },
    { key: 'noveltyTolerance', label: 'Novelty tolerance', min: 0, max: 1, step: 0.005, formatter: (value) => formatPercent(value, 1), nodeId: 'noveltyTolerance' },
  ],
}

const dynamicsLegend = [
  { key: 'skill', label: 'Skill', color: '#67e8f9' },
  { key: 'strategy', label: 'Strategy', color: '#f9a8d4' },
  { key: 'timing', label: 'Timing', color: '#fcd34d' },
  { key: 'consistency', label: 'Consistency', color: '#34d399' },
  { key: 'resilience', label: 'Resilience', color: '#a78bfa' },
]

const allControls = Object.values(sliderGroups).flat()
const controlByKey = Object.fromEntries(allControls.map((control) => [control.key, control]))

function clampValue(value, min, max) {
  return Math.min(max, Math.max(min, value))
}

function trimNumericString(raw) {
  return raw.includes('.') ? raw.replace(/0+$/, '').replace(/\.$/, '') : raw
}

function formatInputValue(control, value) {
  if (control.key === 'n') return String(Math.round(value))

  const precisionPart = String(control.step).split('.')[1]
  const precision = precisionPart ? Math.min(precisionPart.length, 4) : 0

  if (precision === 0) {
    return String(Math.round(value))
  }

  return trimNumericString(Number(value).toFixed(precision))
}

function normalizeControlValue(key, value) {
  const control = controlByKey[key]
  if (!control || !Number.isFinite(value)) return null

  const clamped = clampValue(value, control.min, control.max)
  return key === 'n' ? Math.round(clamped) : Number(clamped.toFixed(4))
}

function sampleCurve(curve, maxPoints = 320) {
  if (curve.length <= maxPoints) return curve

  const sampled = []
  const step = (curve.length - 1) / (maxPoints - 1)

  for (let index = 0; index < maxPoints; index += 1) {
    sampled.push(curve[Math.round(index * step)])
  }

  const deduped = []
  for (const point of sampled) {
    if (!deduped.length || deduped[deduped.length - 1].attempt !== point.attempt) {
      deduped.push(point)
    }
  }

  const lastPoint = curve[curve.length - 1]
  if (deduped[deduped.length - 1]?.attempt !== lastPoint.attempt) {
    deduped.push(lastPoint)
  }

  return deduped
}

function SliderField({ control, value, onChange, onInspect }) {
  const [draft, setDraft] = useState(() => formatInputValue(control, value))

  useEffect(() => {
    setDraft(formatInputValue(control, value))
  }, [control, value])

  const commitDraft = (rawValue) => {
    if (!rawValue.trim()) {
      setDraft(formatInputValue(control, value))
      return
    }

    const parsed = control.key === 'n' ? Number.parseInt(rawValue, 10) : Number(rawValue)
    const normalized = normalizeControlValue(control.key, parsed)

    if (normalized === null) {
      setDraft(formatInputValue(control, value))
      return
    }

    onChange(control.key, normalized)
    setDraft(formatInputValue(control, normalized))
  }

  return (
    <div className="rounded-[26px] border border-white/10 bg-white/[0.04] p-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-sm font-semibold text-white">{control.label}</div>
          <div className="mt-1 text-xs uppercase tracking-[0.22em] text-white/38">{control.key}</div>
        </div>
        <div className="flex items-center gap-2">
          {control.nodeId ? (
            <button type="button" onClick={() => onInspect(control.nodeId)} className="glass-chip text-xs text-white/70">
              inspect
            </button>
          ) : null}
          <span className="rounded-full border border-white/12 bg-black/20 px-3 py-1 text-sm text-white/82">{control.formatter(value)}</span>
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-[minmax(0,1fr)_8.25rem] sm:items-center">
        <input
          className="range-slider"
          type="range"
          min={control.min}
          max={control.max}
          step={control.step}
          value={value}
          onChange={(event) => onChange(control.key, Number(event.target.value))}
        />
        <label className="space-y-2">
          <span className="text-[11px] uppercase tracking-[0.22em] text-white/38">Exact value</span>
          <input
            className="glass-number-input text-sm"
            type="number"
            inputMode={control.key === 'n' ? 'numeric' : 'decimal'}
            min={control.min}
            max={control.max}
            step={control.step}
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onBlur={() => commitDraft(draft)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                commitDraft(draft)
                event.currentTarget.blur()
              }
              if (event.key === 'Escape') {
                setDraft(formatInputValue(control, value))
                event.currentTarget.blur()
              }
            }}
          />
        </label>
      </div>

      <div className="mt-2 flex items-center justify-between text-[11px] uppercase tracking-[0.18em] text-white/34">
        <span>{control.formatter(control.min)}</span>
        <span>{control.formatter(control.max)}</span>
      </div>
    </div>
  )
}

export function SimulatorLab({ onSelect }) {
  const [activePresetId, setActivePresetId] = useState(simulatorPresets[0].id)
  const [inputs, setInputs] = useState(simulatorPresets[0].defaults)
  const deferredInputs = useDeferredValue(inputs)
  const results = computeSuccessCurve(deferredInputs)
  const chartCurve = sampleCurve(results.curve)
  const activePreset = simulatorPresets.find((preset) => preset.id === activePresetId) ?? simulatorPresets[0]
  const outcomeText = describeOutcome(deferredInputs, results)
  const strongestInspectableLever = results.factorImpacts.find((item) => formulaNodeMap[item.id])?.id ?? activePreset.highlightedFactors[0]

  const setPreset = (preset) => {
    startTransition(() => {
      setActivePresetId(preset.id)
      setInputs({ ...preset.defaults })
    })
  }

  const updateInput = (key, value) => {
    const normalized = normalizeControlValue(key, value)
    if (normalized === null) return
    setInputs((current) => ({ ...current, [key]: normalized }))
  }

  const impactChart = results.factorImpacts.map((item) => ({
    factor: item.label,
    impact: Number((item.contribution * 100).toFixed(1)),
  }))

  const finalFactorCards = [
    { label: 'a_t', value: formatPercent(results.finalAttemptActivation, 1), nodeId: 'attemptActivation' },
    { label: 'p_t', value: formatPercent(results.finalAttemptQuality, 1), nodeId: 'attemptQuality' },
    { label: 'C_t', value: formatPercent(results.finalStates.consistency, 1), nodeId: 'consistency' },
    { label: 'R_t', value: formatPercent(results.finalStates.resilience, 1), nodeId: 'resilience' },
    { label: 'G_t', value: formatPercent(results.finalStates.strategy, 1), nodeId: 'strategy' },
    { label: 'N_t', value: formatPercent(results.finalStates.network, 1), nodeId: 'network' },
  ]

  return (
    <section id="simulator" className="section-shell mt-28 scroll-mt-28">
      <SectionHeader
        eyebrow="Simulator Lab"
        title="Push the real leaf variables around and watch the full model move in real time."
        body="The simulator now uses the full nested subfactor structure instead of top-level shortcuts. Many factors evolve over attempts, so the live charts show the success curve, the activation/quality split, and the state dynamics underneath it."
        icon={FlaskConical}
      />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
        <Motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.12 }}
          transition={{ duration: 0.72 }}
          className="glass-panel p-6 sm:p-7"
        >
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="text-xs uppercase tracking-[0.24em] text-white/42">Scenario presets</div>
              <h3 className="mt-2 font-display text-2xl text-white">Choose a game, then tune the leaf variables</h3>
            </div>
            <Tooltip.Root>
              <Tooltip.Trigger asChild>
                <button type="button" className="glass-chip text-white/74">operational coefficients</button>
              </Tooltip.Trigger>
              <Tooltip.Portal>
                <Tooltip.Content sideOffset={10} className="max-w-xs rounded-2xl border border-white/12 bg-slate-950/94 px-4 py-3 text-sm text-white/78 shadow-2xl backdrop-blur-xl">
                  The symbolic formulas match the model. The dynamic coefficients are transparent operational defaults so you can explore behavior without pretending they are universal constants.
                  <Tooltip.Arrow className="fill-slate-950/94" />
                </Tooltip.Content>
              </Tooltip.Portal>
            </Tooltip.Root>
          </div>

          <div className="mt-5 grid gap-3">
            {simulatorPresets.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => setPreset(preset)}
                className={
                  activePresetId === preset.id
                    ? 'rounded-[24px] border border-cyan-300/28 bg-cyan-300/12 p-4 text-left shadow-[0_18px_60px_-30px_rgba(34,211,238,0.65)]'
                    : 'rounded-[24px] border border-white/10 bg-white/[0.04] p-4 text-left transition duration-300 hover:bg-white/[0.06]'
                }
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-base font-semibold text-white">{preset.title}</div>
                    <p className="mt-1 text-sm leading-6 text-white/60">{preset.description}</p>
                  </div>
                  <Target className="mt-1 h-4 w-4 text-white/40" />
                </div>
              </button>
            ))}
          </div>

          <Tabs.Root defaultValue="core" className="mt-7">
            <Tabs.List className="flex gap-2 overflow-x-auto pb-1 md:flex-wrap">
              {[
                { value: 'core', label: 'Core Math' },
                { value: 'strategy', label: 'Strategy' },
                { value: 'persistence', label: 'Persistence' },
                { value: 'environment', label: 'Environment' },
                { value: 'network', label: 'Network' },
                { value: 'learning', label: 'Learning Loop' },
              ].map((tab) => (
                <Tabs.Trigger
                  key={tab.value}
                  value={tab.value}
                  className="whitespace-nowrap rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-white/68 transition data-[state=active]:border-cyan-300/30 data-[state=active]:bg-cyan-300/12 data-[state=active]:text-white"
                >
                  {tab.label}
                </Tabs.Trigger>
              ))}
            </Tabs.List>

            {Object.entries(sliderGroups).map(([key, controls]) => (
              <Tabs.Content key={key} value={key} className="mt-5 space-y-4">
                {controls.map((control) => (
                  <SliderField
                    key={control.key}
                    control={control}
                    value={inputs[control.key]}
                    onChange={updateInput}
                    onInspect={(nodeId) => onSelect(nodeId, true)}
                  />
                ))}
              </Tabs.Content>
            ))}
          </Tabs.Root>
        </Motion.div>

        <Motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.12 }}
          transition={{ duration: 0.72, delay: 0.05 }}
          className="space-y-6"
        >
          <div className="glass-panel p-6 sm:p-7">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="text-xs uppercase tracking-[0.24em] text-white/42">Live readout</div>
                <h3 className="mt-2 font-display text-2xl text-white">{activePreset.title} curve</h3>
              </div>
              <div className="glass-chip max-w-xl text-white/72">{outcomeText}</div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {[
                { label: 'Final success', value: formatPercent(results.finalProbability, 1) },
                { label: 'Expected activated attempts', value: results.expectedActivatedAttempts.toFixed(1) },
                { label: 'Final a_t', value: formatPercent(results.finalAttemptActivation, 1) },
                { label: 'Final p_t', value: formatPercent(results.finalAttemptQuality, 1) },
                { label: 'Skill change', value: `${results.skillDelta >= 0 ? '+' : ''}${formatPercent(results.skillDelta, 1)}` },
                { label: 'Strategy change', value: `${results.strategyDelta >= 0 ? '+' : ''}${formatPercent(results.strategyDelta, 1)}` },
              ].map((metric) => (
                <div key={metric.label} className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5">
                  <div className="text-xs uppercase tracking-[0.24em] text-white/42">{metric.label}</div>
                  <div className="mt-3 font-display text-3xl text-white">{metric.value}</div>
                </div>
              ))}
            </div>

            <div className="mt-4 text-sm leading-6 text-white/56">
              Expected activated attempts is the sum of all `a_t` values across the run, so it represents the model's expected count of real attempts rather than a guaranteed realized count.
            </div>

            <div className="mt-6 h-72 rounded-[30px] border border-white/10 bg-black/15 p-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartCurve} margin={{ top: 12, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="successFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#67e8f9" stopOpacity={0.45} />
                      <stop offset="100%" stopColor="#67e8f9" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
                  <XAxis dataKey="attempt" stroke="rgba(255,255,255,0.45)" tickLine={false} axisLine={false} />
                  <YAxis stroke="rgba(255,255,255,0.45)" tickLine={false} axisLine={false} tickFormatter={(value) => `${Math.round(value * 100)}%`} domain={[0, 1]} />
                  <RechartsTooltip
                    contentStyle={{
                      background: 'rgba(5, 9, 23, 0.94)',
                      border: '1px solid rgba(255,255,255,0.12)',
                      borderRadius: '18px',
                      color: '#fff',
                    }}
                    formatter={(value) => formatPercent(value, 1)}
                    labelFormatter={(label) => `Attempt ${label}`}
                  />
                  <Area type="monotone" dataKey="cumulativeSuccess" stroke="#67e8f9" strokeWidth={3} fill="url(#successFill)" />
                  <Line type="monotone" dataKey="attemptQuality" stroke="#f9a8d4" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="attemptActivation" stroke="#a7f3d0" strokeWidth={2} dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {finalFactorCards.map((card) => (
                <button key={card.label} type="button" onClick={() => onSelect(card.nodeId, true)} className="rounded-[24px] border border-white/10 bg-white/[0.04] p-4 text-left transition hover:bg-white/[0.06]">
                  <div className="text-xs uppercase tracking-[0.24em] text-white/42">{card.label}</div>
                  <div className="mt-2 text-lg font-semibold text-white">{card.value}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-6 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
            <div className="glass-panel p-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="text-xs uppercase tracking-[0.24em] text-white/42">Curve milestones</div>
                  <div className="mt-2 text-xl font-semibold text-white">When the probability starts feeling real</div>
                </div>
                <TrendingUp className="h-5 w-5 text-cyan-200" />
              </div>
              <div className="mt-5 grid gap-3">
                {[
                  { label: '50% chance', value: results.milestones.half },
                  { label: '75% chance', value: results.milestones.strong },
                  { label: '90% chance', value: results.milestones.nearCertain },
                ].map((milestone) => (
                  <div key={milestone.label} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                    <div className="text-xs uppercase tracking-[0.24em] text-white/42">{milestone.label}</div>
                    <div className="mt-2 text-lg text-white">{milestone.value ? `Around attempt ${milestone.value}` : 'Not reached in current range'}</div>
                  </div>
                ))}
              </div>
              {deferredInputs.p0 <= 0 ? (
                <div className="mt-4 rounded-2xl border border-rose-300/18 bg-rose-300/10 p-4 text-sm leading-6 text-rose-50/90">
                  The simulator intentionally preserves the hard edge case: if the base probability is zero, persistence alone cannot produce a win.
                </div>
              ) : null}
            </div>

            <div className="glass-panel p-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="text-xs uppercase tracking-[0.24em] text-white/42">Impact sketch</div>
                  <div className="mt-2 text-xl font-semibold text-white">Which terms are moving the final p_t the most</div>
                </div>
                <button type="button" onClick={() => onSelect(strongestInspectableLever, true)} className="glass-chip text-white/74">
                  inspect strongest lever
                </button>
              </div>
              <div className="mt-5 h-72 rounded-[28px] border border-white/10 bg-black/15 p-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={impactChart} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
                    <XAxis dataKey="factor" stroke="rgba(255,255,255,0.45)" tickLine={false} axisLine={false} />
                    <YAxis stroke="rgba(255,255,255,0.45)" tickLine={false} axisLine={false} />
                    <RechartsTooltip
                      contentStyle={{
                        background: 'rgba(5, 9, 23, 0.94)',
                        border: '1px solid rgba(255,255,255,0.12)',
                        borderRadius: '18px',
                        color: '#fff',
                      }}
                      formatter={(value) => `${value}`}
                    />
                    <Bar dataKey="impact" radius={[10, 10, 0, 0]}>
                      {impactChart.map((item) => (
                        <Cell key={item.factor} fill={item.impact >= 0 ? '#67e8f9' : '#fda4af'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <p className="mt-4 text-sm leading-6 text-white/58">The impact chart is restricted to the direct p_t terms and their explicit interaction terms, which matches the displayed probability formula more closely.</p>
            </div>
          </div>

          <div className="glass-panel p-6 sm:p-7">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="text-xs uppercase tracking-[0.24em] text-white/42">System dynamics</div>
                <div className="mt-2 text-xl font-semibold text-white">Time-varying factors across the run</div>
              </div>
              <div className="flex flex-wrap gap-2">
                {dynamicsLegend.map((item) => (
                  <span key={item.key} className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-white/70">
                    <span className="mr-2 inline-block h-2 w-2 rounded-full align-middle" style={{ backgroundColor: item.color }} />
                    {item.label}
                  </span>
                ))}
              </div>
            </div>
            <div className="mt-5 h-80 rounded-[30px] border border-white/10 bg-black/15 p-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartCurve} margin={{ top: 12, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
                  <XAxis dataKey="attempt" stroke="rgba(255,255,255,0.45)" tickLine={false} axisLine={false} />
                  <YAxis stroke="rgba(255,255,255,0.45)" tickLine={false} axisLine={false} tickFormatter={(value) => `${Math.round(value * 100)}%`} domain={[0, 1]} />
                  <RechartsTooltip
                    contentStyle={{
                      background: 'rgba(5, 9, 23, 0.94)',
                      border: '1px solid rgba(255,255,255,0.12)',
                      borderRadius: '18px',
                      color: '#fff',
                    }}
                    formatter={(value) => formatPercent(value, 1)}
                    labelFormatter={(label) => `Attempt ${label}`}
                  />
                  {dynamicsLegend.map((item) => (
                    <Line key={item.key} type="monotone" dataKey={item.key} stroke={item.color} strokeWidth={2.2} dot={false} />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Motion.div>
      </div>
    </section>
  )
}