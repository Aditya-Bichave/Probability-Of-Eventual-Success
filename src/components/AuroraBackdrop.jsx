import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { useReducedMotion } from 'motion/react'
import { cn } from '../lib/ui'

export function AuroraBackdrop() {
  const reducedMotion = useReducedMotion()
  const orbRefs = useRef([])

  useEffect(() => {
    if (reducedMotion) return undefined

    const ctx = gsap.context(() => {
      orbRefs.current.forEach((orb, index) => {
        if (!orb) return

        gsap.to(orb, {
          x: index % 2 === 0 ? 70 : -60,
          y: index === 1 ? -50 : 60,
          scale: 1.12 + index * 0.02,
          duration: 16 + index * 4,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        })
      })
    })

    return () => ctx.revert()
  }, [reducedMotion])

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.18),transparent_35%),radial-gradient(circle_at_80%_10%,rgba(251,113,133,0.12),transparent_25%),linear-gradient(180deg,#040816_0%,#050917_40%,#03040d_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:74px_74px] opacity-[0.08]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.09),transparent_60%)] opacity-30" />
      {[
        'left-[8%] top-[12%] h-72 w-72 bg-cyan-400/18',
        'right-[10%] top-[22%] h-80 w-80 bg-fuchsia-400/14',
        'bottom-[8%] left-[26%] h-96 w-96 bg-emerald-300/12',
      ].map((className, index) => (
        <div
          key={className}
          ref={(element) => {
            orbRefs.current[index] = element
          }}
          className={cn('absolute rounded-full blur-3xl', className)}
        />
      ))}
      <div className="noise-mask absolute inset-0" />
    </div>
  )
}
