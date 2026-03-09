import { lazy, startTransition, Suspense, useEffect, useState } from 'react'
import Lenis from 'lenis'
import * as Tooltip from '@radix-ui/react-tooltip'
import { AuroraBackdrop } from './components/AuroraBackdrop'
import { HeroSection } from './components/HeroSection'
import { Navbar } from './components/Navbar'
import { defaultNodeId } from './content/formulaGraph'

const FormulaExplorer = lazy(() => import('./components/FormulaExplorer').then((module) => ({ default: module.FormulaExplorer })))
const FactorAtlas = lazy(() => import('./components/FactorAtlas').then((module) => ({ default: module.FactorAtlas })))
const SimulatorLab = lazy(() => import('./components/SimulatorLab').then((module) => ({ default: module.SimulatorLab })))
const ResearchSection = lazy(() => import('./components/ResearchSection').then((module) => ({ default: module.ResearchSection })))

function SectionFallback({ tall = false }) {
  return <div className={`section-shell mt-20 animate-pulse rounded-[32px] border border-white/8 bg-white/[0.03] ${tall ? 'h-[32rem]' : 'h-40'}`} />
}

function App() {
  const [selectedNodeId, setSelectedNodeId] = useState(defaultNodeId)

  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.08,
      smoothWheel: true,
      wheelMultiplier: 0.9,
    })

    let frameId = 0

    const raf = (time) => {
      lenis.raf(time)
      frameId = window.requestAnimationFrame(raf)
    }

    frameId = window.requestAnimationFrame(raf)

    return () => {
      window.cancelAnimationFrame(frameId)
      lenis.destroy()
    }
  }, [])

  const selectNode = (nodeId, jumpToExplorer = false) => {
    startTransition(() => {
      setSelectedNodeId(nodeId)
    })

    if (jumpToExplorer) {
      window.requestAnimationFrame(() => {
        document.getElementById('explorer')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      })
    }
  }

  return (
    <Tooltip.Provider delayDuration={120}>
      <div className="relative min-h-screen overflow-x-hidden bg-slate-950 text-white">
        <AuroraBackdrop />
        <Navbar />
        <main>
          <HeroSection />
          <Suspense fallback={<SectionFallback tall />}>
            <FormulaExplorer selectedNodeId={selectedNodeId} onSelect={(nodeId) => selectNode(nodeId)} />
          </Suspense>
          <Suspense fallback={<SectionFallback />}>
            <FactorAtlas onSelect={selectNode} />
          </Suspense>
          <Suspense fallback={<SectionFallback tall />}>
            <SimulatorLab onSelect={selectNode} />
          </Suspense>
          <Suspense fallback={<SectionFallback />}>
            <ResearchSection />
          </Suspense>
        </main>
      </div>
    </Tooltip.Provider>
  )
}

export default App
