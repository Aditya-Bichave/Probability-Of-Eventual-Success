import { useState } from 'react'
import { motion as Motion } from 'motion/react'
import { ArrowRight, Sparkles } from 'lucide-react'
import { BlockMath } from 'react-katex'

function MagneticLink({ href, children, variant = 'primary' }) {
  const [transform, setTransform] = useState({ x: 0, y: 0 })

  return (
    <Motion.a
      href={href}
      onMouseMove={(event) => {
        const bounds = event.currentTarget.getBoundingClientRect()
        const x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 12
        const y = ((event.clientY - bounds.top) / bounds.height - 0.5) * 12
        setTransform({ x, y })
      }}
      onMouseLeave={() => setTransform({ x: 0, y: 0 })}
      animate={{ x: transform.x, y: transform.y }}
      transition={{ type: 'spring', stiffness: 240, damping: 18, mass: 0.5 }}
      className={
        variant === 'primary'
          ? 'inline-flex items-center gap-2 rounded-full border border-cyan-100/70 bg-cyan-100 px-5 py-3 text-sm font-semibold !text-slate-950 shadow-[0_20px_70px_-30px_rgba(255,255,255,0.85)] transition-all duration-300 hover:bg-white'
          : 'glass-chip inline-flex items-center gap-2 text-white hover:bg-white/18'
      }
    >
      {children}
      <ArrowRight className="h-4 w-4" />
    </Motion.a>
  )
}

export function HeroSection() {
  return (
    <section id="hero" className="section-shell relative pt-32 sm:pt-36 lg:pt-40">
      <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)]">
        <Motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="space-y-8"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/7 px-4 py-2 text-sm text-white/72">
            <Sparkles className="h-4 w-4 text-cyan-200" />
            Research-grounded probability atlas for persistence, timing, learning, and compounding odds
          </div>

          <div className="space-y-5">
            <h1 className="max-w-4xl font-display text-5xl tracking-tight text-white sm:text-6xl lg:text-7xl">
              A premium interactive website for the full math of eventual success.
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-white/68 sm:text-xl">
              Start with the simple intuition, open the full nested model, and simulate how real attempts, changing conditions, and learning loops move the curve over time.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <MagneticLink href="#explorer">Open formula explorer</MagneticLink>
            <MagneticLink href="#simulator" variant="secondary">
              Run live simulator
            </MagneticLink>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {[
              {
                title: 'Volume matters',
                body: 'If the chance is nonzero, enough real attempts can push eventual success startlingly high.',
              },
              {
                title: 'Quality matters',
                body: 'Skill, strategy, timing, environment, network, and focus shape the live success chance p_t.',
              },
              {
                title: 'Learning matters',
                body: 'Feedback and adaptability turn repetition into a better system instead of stale effort.',
              },
            ].map((card) => (
              <div key={card.title} className="glass-panel p-5">
                <div className="text-sm font-semibold text-white">{card.title}</div>
                <p className="mt-2 text-sm leading-6 text-white/62">{card.body}</p>
              </div>
            ))}
          </div>
        </Motion.div>

        <Motion.div
          initial={{ opacity: 0, scale: 0.96, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          className="glass-panel relative overflow-hidden p-6 sm:p-8"
        >
          <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-br from-cyan-400/18 via-fuchsia-400/10 to-transparent" />
          <div className="relative space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="text-xs uppercase tracking-[0.24em] text-white/42">Core formulas</div>
                <div className="mt-2 text-lg font-semibold text-white">From the classic limit to the full research model</div>
              </div>
              <div className="glass-chip text-white/72">beautiful, nested, and explorable</div>
            </div>

            <div className="grid gap-4">
              <div className="rounded-[30px] border border-white/10 bg-black/15 p-5 shadow-[0_28px_80px_-50px_rgba(0,0,0,0.95)]">
                <div className="text-xs uppercase tracking-[0.24em] text-white/42">Original intuition</div>
                <div className="mt-3 space-y-3">
                  <BlockMath math="\\lim_{n\\to\\infty}\\left(1-(1-p)^n\\right)=1\\quad\\text{for }p>0" />
                  <p className="text-sm leading-6 text-white/64">
                    In plain English: if each try has a real chance, enough tries make at least one success very likely.
                  </p>
                </div>
              </div>

              <div className="rounded-[30px] border border-white/10 bg-black/15 p-5 shadow-[0_28px_80px_-50px_rgba(0,0,0,0.95)]">
                <div className="text-xs uppercase tracking-[0.24em] text-white/42">Expanded model</div>
                <div className="mt-3 space-y-3">
                  <BlockMath math="P(\\text{success by } n)=1-\\prod_{t=1}^{n}\\left(1-a_t\\,p_t\\right)" />
                  <p className="text-sm leading-6 text-white/64">
                    The richer version splits one big idea into two realities: whether an attempt actually happens and how good that live attempt is.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5">
                <div className="text-xs uppercase tracking-[0.24em] text-white/42">Worked example</div>
                <div className="mt-3 font-display text-xl text-white">If p = 0.1</div>
                <p className="mt-2 text-sm leading-6 text-white/64">After 10 tries: 1 - 0.9^10 approx 65.1%</p>
                <p className="mt-2 text-sm leading-6 text-white/64">After 100 tries: 1 - 0.9^100 approx 99.997%</p>
              </div>
              <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5">
                <div className="text-xs uppercase tracking-[0.24em] text-white/42">Critical caveats</div>
                <div className="mt-3 space-y-2 text-sm leading-6 text-white/64">
                  <p>Not a promise of a quick win.</p>
                  <p>Not proof every game is beatable by persistence.</p>
                  <p>Not proof the expected reward is worth it.</p>
                  <p>And none of this works when p = 0.</p>
                </div>
              </div>
            </div>
          </div>
        </Motion.div>
      </div>
    </section>
  )
}