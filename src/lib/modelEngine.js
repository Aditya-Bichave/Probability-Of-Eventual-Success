const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value))
const sigmoid = (value) => 1 / (1 + Math.exp(-value))
const logit = (value) => Math.log(value / (1 - value))
const midpointShift = (value) => (clamp(value) - 0.5) * 2

const geometricMean = (values) => {
  const safeValues = values.map((value) => clamp(value, 0, 1))
  if (safeValues.some((value) => value <= 0)) return 0
  return Math.pow(safeValues.reduce((product, value) => product * value, 1), 1 / safeValues.length)
}

const factorWeights = {
  skill: 1.35,
  strategy: 1.18,
  timing: 0.86,
  environment: 0.78,
  network: 0.72,
  focus: 0.94,
}

const interactionWeights = {
  skillNetwork: 0.52,
  strategyTiming: 0.44,
}

const dynamics = {
  etaS: 0.22,
  lambdaS: 0.008,
  etaG: 0.09,
}

const directFactorLabels = [
  { key: 'skill', label: 'Skill' },
  { key: 'strategy', label: 'Strategy' },
  { key: 'timing', label: 'Timing' },
  { key: 'environment', label: 'Environment' },
  { key: 'network', label: 'Network' },
  { key: 'focus', label: 'Focus' },
]

function createBaselineState(inputs) {
  return {
    skill: clamp(inputs.S0),
    goalClarity: clamp(inputs.goalClarity),
    targetFit: clamp(inputs.targetFit),
    planQuality: clamp(inputs.planQuality),
    learningBalance: clamp(inputs.learningBalance),
    adherenceRate: clamp(inputs.adherenceRate),
    spacingQuality: clamp(inputs.spacingQuality),
    recovery: clamp(inputs.recovery),
    regulation: clamp(inputs.regulation),
    stressTolerance: clamp(inputs.stressTolerance),
    control: clamp(inputs.control),
    support: clamp(inputs.support),
    tools: clamp(inputs.tools),
    timeResource: clamp(inputs.timeResource),
    runway: clamp(inputs.runway),
    relevance: clamp(inputs.relevance),
    trust: clamp(inputs.trust),
    reach: clamp(inputs.reach),
    activation: clamp(inputs.activation),
    sponsorship: clamp(inputs.sponsorship),
    deepWork: clamp(inputs.deepWork),
    switchCost: clamp(inputs.switchCost),
    feedbackQuality: clamp(inputs.feedbackQuality),
    receptivity: clamp(inputs.receptivity),
    taskFocus: clamp(inputs.taskFocus),
    cognitiveFlex: clamp(inputs.cognitiveFlex),
    learningOrientation: clamp(inputs.learningOrientation),
    updateSpeed: clamp(inputs.updateSpeed),
    noveltyTolerance: clamp(inputs.noveltyTolerance),
  }
}

const cloneState = (state) => ({ ...state })

function deriveFactors(state, inputs, progress) {
  const timing = clamp(inputs.timingBase + inputs.timingTrend * progress + inputs.timingSwing * Math.sin(progress * Math.PI * 2))
  const consistency = clamp(state.adherenceRate * state.spacingQuality)
  const resilience = geometricMean([state.recovery, state.regulation, state.stressTolerance])
  const environment = geometricMean([state.control, state.support, state.tools, state.timeResource, state.runway])
  const network = geometricMean([state.relevance, state.trust, state.reach, state.activation, state.sponsorship])
  const focus = clamp(state.deepWork * (1 - state.switchCost))
  const feedback = clamp(state.feedbackQuality * state.receptivity * state.taskFocus)
  const adaptability = geometricMean([state.cognitiveFlex, state.learningOrientation, state.updateSpeed, state.noveltyTolerance])
  const strategy = geometricMean([state.goalClarity, state.targetFit, state.planQuality, state.learningBalance])

  return {
    timing,
    consistency,
    resilience,
    environment,
    network,
    focus,
    feedback,
    adaptability,
    strategy,
    attemptActivation: clamp(consistency * resilience),
  }
}

function relax(current, baseline, rate) {
  return current + rate * (baseline - current)
}

function updateState(state, baseline, factors, summary, progress, inputs) {
  const next = cloneState(state)
  const stress = summary.stressLoad
  const success = summary.effectiveAttemptSuccess
  const attemptActivation = factors.attemptActivation
  const failurePressure = clamp(attemptActivation * (1 - summary.attemptQuality) + (1 - attemptActivation) * 0.15)
  const supportShift = midpointShift(baseline.support)
  const controlShift = midpointShift(baseline.control)
  const learningShift = midpointShift(baseline.learningOrientation)

  next.recovery = clamp(relax(next.recovery, baseline.recovery, 0.16) + 0.03 * supportShift + 0.04 * success - 0.05 * stress)
  next.regulation = clamp(relax(next.regulation, baseline.regulation, 0.16) + 0.025 * controlShift + 0.02 * learningShift - 0.04 * stress + 0.02 * success)
  next.stressTolerance = clamp(relax(next.stressTolerance, baseline.stressTolerance, 0.14) + 0.025 * supportShift + 0.02 * midpointShift(baseline.cognitiveFlex) - 0.035 * stress)

  next.adherenceRate = clamp(relax(next.adherenceRate, baseline.adherenceRate, 0.14) + 0.03 * midpointShift(factors.resilience) + 0.025 * success - 0.04 * stress)
  next.spacingQuality = clamp(
    relax(next.spacingQuality, baseline.spacingQuality, 0.12) +
      0.02 * controlShift -
      0.018 * Math.abs(Math.sin(progress * Math.PI * 2)) * inputs.timingSwing -
      0.02 * stress,
  )

  next.timeResource = clamp(relax(next.timeResource, baseline.timeResource, 0.12) + 0.025 * controlShift + 0.015 * supportShift - 0.03 * stress - 0.008 * progress)
  next.runway = clamp(relax(next.runway, baseline.runway, 0.08) + 0.02 * supportShift - 0.012 * progress - 0.01 * stress + 0.008 * success)

  next.activation = clamp(relax(next.activation, baseline.activation, 0.1) + 0.03 * midpointShift(factors.consistency) + 0.025 * midpointShift(baseline.trust) + 0.02 * success)
  next.sponsorship = clamp(relax(next.sponsorship, baseline.sponsorship, 0.08) + 0.03 * midpointShift(state.skill) + 0.025 * midpointShift(baseline.trust) + 0.015 * success)

  next.deepWork = clamp(relax(next.deepWork, baseline.deepWork, 0.14) + 0.03 * midpointShift(state.timeResource) + 0.02 * controlShift - 0.03 * stress)
  next.switchCost = clamp(relax(next.switchCost, baseline.switchCost, 0.14) + 0.03 * stress - 0.025 * controlShift - 0.02 * learningShift)

  next.feedbackQuality = clamp(relax(next.feedbackQuality, baseline.feedbackQuality, 0.12) + 0.02 * midpointShift(factors.network) + 0.01 * success)
  next.receptivity = clamp(relax(next.receptivity, baseline.receptivity, 0.14) + 0.025 * midpointShift(factors.resilience) + 0.02 * learningShift - 0.02 * stress)
  next.taskFocus = clamp(relax(next.taskFocus, baseline.taskFocus, 0.14) + 0.025 * midpointShift(factors.focus) + 0.02 * midpointShift(next.regulation) - 0.02 * stress)

  next.updateSpeed = clamp(relax(next.updateSpeed, baseline.updateSpeed, 0.12) + 0.03 * midpointShift(factors.feedback) + 0.012 * success)
  next.noveltyTolerance = clamp(relax(next.noveltyTolerance, baseline.noveltyTolerance, 0.12) + 0.02 * midpointShift(next.recovery) + 0.015 * learningShift - 0.015 * stress)

  const strategyGain = dynamics.etaG * factors.feedback * factors.adaptability * (1 - factors.strategy)
  const overloadPenalty = 0.008 * Math.max(0, next.feedbackQuality - 0.92) * Math.max(0, next.updateSpeed - 0.88)
  next.goalClarity = clamp(relax(next.goalClarity, baseline.goalClarity, 0.08) + 0.18 * strategyGain)
  next.targetFit = clamp(relax(next.targetFit, baseline.targetFit, 0.08) + 0.26 * strategyGain + 0.01 * midpointShift(factors.network))
  next.planQuality = clamp(relax(next.planQuality, baseline.planQuality, 0.08) + 0.32 * strategyGain)
  next.learningBalance = clamp(relax(next.learningBalance, baseline.learningBalance, 0.1) + 0.16 * strategyGain - overloadPenalty)

  next.skill = clamp(
    state.skill + dynamics.etaS * factors.consistency * factors.focus * factors.feedback * factors.adaptability * factors.environment * (1 - state.skill) - dynamics.lambdaS * (1 - factors.focus) * state.skill,
  )

  return {
    next,
    nextStressLoad: clamp(stress * 0.72 + 0.14 * failurePressure - 0.1 * success * factors.resilience),
  }
}

export function computeSuccessCurve(inputs) {
  const totalAttempts = Math.max(1, Math.round(inputs.n))
  const rawBaseChance = clamp(inputs.p0, 0, 0.999)
  const baseline = createBaselineState(inputs)
  const initialFactors = deriveFactors(baseline, inputs, 0)
  const state = cloneState(baseline)

  let cumulativeFailure = 1
  let cumulativeActivation = 0
  let stressLoad = 0
  let milestones = { half: null, strong: null, nearCertain: null }

  const curve = []

  for (let attempt = 1; attempt <= totalAttempts; attempt += 1) {
    const progress = totalAttempts === 1 ? 0 : (attempt - 1) / (totalAttempts - 1)
    const factors = deriveFactors(state, inputs, progress)

    let attemptQuality = 0

    if (rawBaseChance > 0) {
      const qualityLogit =
        logit(rawBaseChance) +
        factorWeights.skill * midpointShift(state.skill) +
        factorWeights.strategy * midpointShift(factors.strategy) +
        factorWeights.timing * midpointShift(factors.timing) +
        factorWeights.environment * midpointShift(factors.environment) +
        factorWeights.network * midpointShift(factors.network) +
        factorWeights.focus * midpointShift(factors.focus) +
        interactionWeights.skillNetwork * midpointShift(state.skill) * midpointShift(factors.network) +
        interactionWeights.strategyTiming * midpointShift(factors.strategy) * midpointShift(factors.timing)

      attemptQuality = clamp(sigmoid(qualityLogit), 0, 0.999999)
    }

    const effectiveAttemptSuccess = clamp(factors.attemptActivation * attemptQuality, 0, 0.999999)
    cumulativeActivation += factors.attemptActivation
    cumulativeFailure *= 1 - effectiveAttemptSuccess

    const cumulativeSuccess = clamp(1 - cumulativeFailure, 0, 0.999999)

    if (milestones.half === null && cumulativeSuccess >= 0.5) milestones.half = attempt
    if (milestones.strong === null && cumulativeSuccess >= 0.75) milestones.strong = attempt
    if (milestones.nearCertain === null && cumulativeSuccess >= 0.9) milestones.nearCertain = attempt

    curve.push({
      attempt,
      cumulativeSuccess,
      effectiveAttemptSuccess,
      attemptActivation: factors.attemptActivation,
      attemptQuality,
      consistency: factors.consistency,
      resilience: factors.resilience,
      skill: state.skill,
      strategy: factors.strategy,
      timing: factors.timing,
      environment: factors.environment,
      network: factors.network,
      focus: factors.focus,
      feedback: factors.feedback,
      adaptability: factors.adaptability,
      adherenceRate: state.adherenceRate,
      spacingQuality: state.spacingQuality,
      recovery: state.recovery,
      regulation: state.regulation,
      stressTolerance: state.stressTolerance,
      goalClarity: state.goalClarity,
      targetFit: state.targetFit,
      planQuality: state.planQuality,
      learningBalance: state.learningBalance,
      control: state.control,
      support: state.support,
      tools: state.tools,
      timeResource: state.timeResource,
      runway: state.runway,
      relevance: state.relevance,
      trust: state.trust,
      reach: state.reach,
      activation: state.activation,
      sponsorship: state.sponsorship,
      deepWork: state.deepWork,
      switchCost: state.switchCost,
      feedbackQuality: state.feedbackQuality,
      receptivity: state.receptivity,
      taskFocus: state.taskFocus,
      cognitiveFlex: state.cognitiveFlex,
      learningOrientation: state.learningOrientation,
      updateSpeed: state.updateSpeed,
      noveltyTolerance: state.noveltyTolerance,
      stressLoad,
    })

    const updated = updateState(state, baseline, factors, { effectiveAttemptSuccess, attemptQuality, stressLoad }, progress, inputs)
    Object.assign(state, updated.next)
    stressLoad = updated.nextStressLoad
  }

  const finalProgress = totalAttempts === 1 ? 0 : 1
  const finalFactors = deriveFactors(state, inputs, finalProgress)
  const finalAttemptQuality = rawBaseChance > 0
    ? clamp(
        sigmoid(
          logit(rawBaseChance) +
            factorWeights.skill * midpointShift(state.skill) +
            factorWeights.strategy * midpointShift(finalFactors.strategy) +
            factorWeights.timing * midpointShift(finalFactors.timing) +
            factorWeights.environment * midpointShift(finalFactors.environment) +
            factorWeights.network * midpointShift(finalFactors.network) +
            factorWeights.focus * midpointShift(finalFactors.focus) +
            interactionWeights.skillNetwork * midpointShift(state.skill) * midpointShift(finalFactors.network) +
            interactionWeights.strategyTiming * midpointShift(finalFactors.strategy) * midpointShift(finalFactors.timing),
        ),
        0,
        0.999999,
      )
    : 0

  const finalStates = {
    ...state,
    ...finalFactors,
    attemptQuality: finalAttemptQuality,
    effectiveAttemptSuccess: clamp(finalFactors.attemptActivation * finalAttemptQuality, 0, 0.999999),
    stressLoad,
  }

  const factorImpacts = [
    ...directFactorLabels.map((factor) => {
      const contribution = factorWeights[factor.key] * midpointShift(finalStates[factor.key])
      return { id: factor.key, label: factor.label, contribution, score: finalStates[factor.key] }
    }),
    {
      id: 'skill-network',
      label: 'Skill x Network',
      contribution: interactionWeights.skillNetwork * midpointShift(finalStates.skill) * midpointShift(finalStates.network),
      score: finalStates.skill * finalStates.network,
    },
    {
      id: 'strategy-timing',
      label: 'Strategy x Timing',
      contribution: interactionWeights.strategyTiming * midpointShift(finalStates.strategy) * midpointShift(finalStates.timing),
      score: finalStates.strategy * finalStates.timing,
    },
  ].sort((left, right) => Math.abs(right.contribution) - Math.abs(left.contribution))

  return {
    curve,
    milestones,
    finalProbability: curve[curve.length - 1]?.cumulativeSuccess ?? 0,
    finalAttemptActivation: finalStates.attemptActivation,
    finalAttemptQuality,
    finalEffectiveAttemptSuccess: finalStates.effectiveAttemptSuccess,
    expectedActivatedAttempts: cumulativeActivation,
    effectiveAttempts: cumulativeActivation,
    skillDelta: finalStates.skill - baseline.skill,
    strategyDelta: finalStates.strategy - initialFactors.strategy,
    factorImpacts,
    finalStates,
  }
}

export function formatPercent(value, digits = 1) {
  return `${(value * 100).toFixed(digits)}%`
}

export function describeOutcome(inputs, results) {
  if (inputs.p0 <= 0) {
    return 'With a base probability of zero, persistence alone cannot create a win. The model keeps that hard stop on purpose.'
  }

  if (results.finalProbability >= 0.95) {
    return 'The system is compounding strongly. Attempts are staying alive, attempt quality is healthy, and the cumulative curve becomes very favorable, though never guaranteed.'
  }

  if (results.finalProbability >= 0.7) {
    return 'The curve is healthy. Volume is helping because enough attempts are activating and the quality stack is supportive.'
  }

  if (results.finalProbability >= 0.4) {
    return 'The model is in the middle zone. Persistence is doing some work, but activation and attempt quality still have meaningful room to improve.'
  }

  return 'The curve is still shallow. Either too few attempts are surviving contact with reality, or the per-attempt quality stack is still weak.'
}

