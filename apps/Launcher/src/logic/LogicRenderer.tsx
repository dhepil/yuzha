import React from 'react'
import type { LogicConfig } from './sceneTypes'
import { mountPixi, type PixiAdapterHandle } from './LogicRendererPixi'

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
    let handle: PixiAdapterHandle | null = null

    let cancelled = false
    ;(async () => {
      try {
        handle = await mountPixi(el, cfg, { dprCap: 2, resizeTo: window })
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