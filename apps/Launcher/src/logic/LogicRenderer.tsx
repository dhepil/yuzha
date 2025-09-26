import React from 'react'
import type { LogicConfig } from './LogicTypes'
import { mountLogicStage, type LogicStageHandle } from '../pixi/logicAdapter'

export type LogicRendererProps = {
  cfg: LogicConfig
  className?: string
}

export default function LogicRenderer(props: LogicRendererProps) {
  const { cfg, className } = props
  const ref = React.useRef<HTMLDivElement | null>(null)

  React.useEffect(() => {
    const el = ref.current
    if (!el) return
    let handle: LogicStageHandle | null = null

    let cancelled = false
    ;(async () => {
      try {
        handle = await mountLogicStage(el, cfg, { dprCap: 2 })
      } catch (e) {
        if (!cancelled) console.error('[LogicRenderer] mount failed', e)
      }
    })()

    return () => {
      cancelled = true
      try { handle?.dispose() } catch {}
    }
  }, [cfg])

  return <div ref={ref} className={className ?? 'w-full h-full'} />
}
