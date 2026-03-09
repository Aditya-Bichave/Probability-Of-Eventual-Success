import { defaultNodeId, formulaNodeMap } from '../content/formulaGraph'

export const themeStyles = {
  cyan: {
    pill: 'border-cyan-300/25 bg-cyan-300/12 text-cyan-50',
    glow: 'from-cyan-400/18 via-cyan-400/4 to-transparent',
    edge: 'border-cyan-300/22',
  },
  amber: {
    pill: 'border-amber-300/25 bg-amber-300/12 text-amber-50',
    glow: 'from-amber-400/18 via-amber-400/4 to-transparent',
    edge: 'border-amber-300/22',
  },
  coral: {
    pill: 'border-rose-300/25 bg-rose-300/12 text-rose-50',
    glow: 'from-rose-400/18 via-rose-400/4 to-transparent',
    edge: 'border-rose-300/22',
  },
  mint: {
    pill: 'border-emerald-300/25 bg-emerald-300/12 text-emerald-50',
    glow: 'from-emerald-400/18 via-emerald-400/4 to-transparent',
    edge: 'border-emerald-300/22',
  },
  violet: {
    pill: 'border-fuchsia-300/25 bg-fuchsia-300/12 text-fuchsia-50',
    glow: 'from-fuchsia-400/18 via-fuchsia-400/4 to-transparent',
    edge: 'border-fuchsia-300/22',
  },
}

export function cn(...parts) {
  return parts.filter(Boolean).join(' ')
}

export function getNodeTheme(node) {
  return themeStyles[node?.visualTheme] ?? themeStyles.cyan
}

export function findPathToNode(targetId, currentId = defaultNodeId, visited = new Set()) {
  if (visited.has(currentId)) return null

  const nextVisited = new Set(visited)
  nextVisited.add(currentId)

  if (currentId === targetId) return [currentId]

  const currentNode = formulaNodeMap[currentId]

  for (const childId of currentNode?.children ?? []) {
    const childPath = findPathToNode(targetId, childId, nextVisited)
    if (childPath) return [currentId, ...childPath]
  }

  return null
}
