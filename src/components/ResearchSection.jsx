import { motion as Motion } from 'motion/react'
import { BookOpenText, ExternalLink, Sparkles } from 'lucide-react'
import { researchSources } from '../content/formulaGraph'
import { SectionHeader } from './SectionHeader'

export function ResearchSection() {
  return (
    <section id="research" className="section-shell mt-28 scroll-mt-28 pb-24">
      <SectionHeader
        eyebrow="Research Grounding"
        title="A concise evidence layer under the visual polish."
        body="The structure of the model is research-informed. The simulator coefficients and operational dynamics are illustrative defaults designed to keep the system explorable, not universal constants that apply identically to every domain."
        icon={BookOpenText}
      />

      <div className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
        <Motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.12 }}
          transition={{ duration: 0.72 }}
          className="glass-panel p-6 sm:p-7"
        >
          <div className="flex items-center gap-3 text-cyan-100">
            <Sparkles className="h-5 w-5" />
            <div className="text-sm uppercase tracking-[0.24em] text-white/56">Interpretation rules</div>
          </div>
          <div className="mt-6 space-y-4 text-sm leading-7 text-white/72">
            <p>The cumulative probability logic is mathematically sound: repeated nonzero chances push the chance of at least one success upward.</p>
            <p>The expanded model adds realism by separating attempt activation, attempt quality, and improvement over time.</p>
            <p>The simulator turns several time-varying constructs into explicit client-side dynamics so the model can be explored interactively.</p>
          </div>

          <div className="mt-6 rounded-[28px] border border-white/10 bg-white/[0.04] p-5">
            <div className="text-xs uppercase tracking-[0.24em] text-white/42">What this does not mean</div>
            <div className="mt-4 space-y-3 text-sm leading-7 text-white/68">
              <p>It does not guarantee a quick win.</p>
              <p>It does not mean every game is beatable by persistence.</p>
              <p>It does not mean the expected reward is automatically worth the cost.</p>
              <p>It does not defeat the hard edge case where p_0 = 0.</p>
              <p>It does not claim one universal coefficient set for jobs, startups, exams, sales, and content growth.</p>
            </div>
          </div>

          <div className="mt-6 rounded-[28px] border border-white/10 bg-white/[0.04] p-5 text-sm leading-7 text-white/68">
            Treat this as a research-informed decision model and thinking framework, not a cosmic truth machine.
          </div>
        </Motion.div>

        <div className="grid gap-4 md:grid-cols-2">
          {researchSources.map((source, index) => (
            <Motion.a
              key={source.id}
              href={source.href}
              target="_blank"
              rel="noreferrer"
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.12 }}
              transition={{ duration: 0.68, delay: index * 0.03 }}
              className="glass-panel group p-5 transition hover:-translate-y-1 hover:bg-white/[0.08]"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-xs uppercase tracking-[0.24em] text-white/42">{source.host}</div>
                  <div className="mt-2 text-lg font-semibold text-white">{source.title}</div>
                </div>
                <ExternalLink className="mt-1 h-4 w-4 text-white/40 transition group-hover:text-white/72" />
              </div>
              <p className="mt-4 text-sm leading-6 text-white/64">{source.insight}</p>
            </Motion.a>
          ))}
        </div>
      </div>

      <footer className="mt-10 rounded-[34px] border border-white/10 bg-black/18 px-6 py-5 text-sm text-white/52 sm:px-8">
        Probability of Eventual Success Atlas. Built as a fully client-side Vite experience with animated glassmorphism, nested formula drill-downs, and a live exploratory simulator.
      </footer>
    </section>
  )
}
