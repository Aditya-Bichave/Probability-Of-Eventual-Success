import { motion as Motion, useScroll, useSpring } from 'motion/react'
import { Orbit } from 'lucide-react'

const sections = [
  { id: 'hero', label: 'Overview' },
  { id: 'explorer', label: 'Explorer' },
  { id: 'atlas', label: 'Factors' },
  { id: 'simulator', label: 'Simulator' },
  { id: 'research', label: 'Research' },
]

export function Navbar() {
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 28,
    mass: 0.2,
  })

  return (
    <>
      <Motion.div
        className="fixed inset-x-0 top-0 z-50 h-px origin-left bg-gradient-to-r from-cyan-300 via-fuchsia-300 to-amber-200"
        style={{ scaleX: progress }}
      />
      <header className="fixed inset-x-0 top-4 z-40 px-4 sm:px-6 lg:px-10">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 rounded-full border border-white/12 bg-slate-950/55 px-4 py-3 shadow-[0_28px_90px_-40px_rgba(0,0,0,0.95)] backdrop-blur-2xl">
          <a href="#hero" className="flex min-w-0 items-center gap-3 text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-white/80 sm:text-sm">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-cyan-300/25 bg-cyan-300/12 text-cyan-100">
              <Orbit className="h-4 w-4" />
            </span>
            <span className="truncate">Probability Atlas</span>
          </a>
          <nav className="hidden items-center gap-1 md:flex">
            {sections.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="rounded-full px-3 py-2 text-sm text-white/64 transition hover:bg-white/8 hover:text-white"
              >
                {section.label}
              </a>
            ))}
          </nav>
          <a href="#simulator" className="glass-chip hidden text-sm text-white lg:inline-flex">
            Run the model
          </a>
        </div>
      </header>
    </>
  )
}