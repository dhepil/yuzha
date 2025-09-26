import type { Application, Sprite } from 'pixi.js'
import type { LayerConfig } from '../logic/LogicTypes'
import { STAGE_WIDTH, STAGE_HEIGHT } from '../utils/stage-transform'

// Ordering helper: derive z-index from layer id
export function logicZIndexFor(cfg: LayerConfig): number {
  const m = cfg.id.match(/\d+/)
  return m ? parseInt(m[0], 10) : 0
}

// Sort layers by z-index then id for deterministic render order
export function sortLayersForRender(layers: LayerConfig[]): LayerConfig[] {
  return [...layers].sort((a, b) => {
    const za = logicZIndexFor(a)
    const zb = logicZIndexFor(b)
    if (za !== zb) return za - zb
    return a.id.localeCompare(b.id)
  })
}

// Apply basic placement (position, scale, z-index) to a sprite
export function logicApplyBasicTransform(app: Application, sp: Sprite, cfg: LayerConfig) {
  const w = STAGE_WIDTH
  const h = STAGE_HEIGHT
  const xPct = cfg.position.xPct ?? 0
  const yPct = cfg.position.yPct ?? 0
  sp.x = (xPct / 100) * w
  sp.y = (yPct / 100) * h
  const s = (cfg.scale?.pct ?? 100) / 100
  sp.scale.set(s, s)
  sp.zIndex = logicZIndexFor(cfg)
}
