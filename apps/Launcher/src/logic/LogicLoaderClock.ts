import type { Application, Sprite } from 'pixi.js'
import type { BuiltLayer } from './LogicTypes'
import type { LayerConfig } from './sceneTypes'
import { toRad } from './LogicMath'

type TimeSource = {
  mode: 'device' | 'utc' | 'server'
  tzOffsetMinutes?: number | null
}

export type ClockItem = {
  sprite: Sprite
  cfg: LayerConfig
  handSpin: 'second' | 'minute' | 'hour'
  handOrbit: 'second' | 'minute' | 'hour'
  format: 12 | 24
  overrideSpin: boolean
  smooth: boolean
  tipRad: number
  source: TimeSource
  baseAngleRad: number
  // orbit override geometry (optional)
  overrideOrbit: boolean
  centerPct?: { x: number; y: number }
  centerPx?: { cx: number; cy: number }
  radius?: number
}

function getTimeParts(src: TimeSource) {
  const now = Date.now()
  if (src.mode === 'utc' || src.tzOffsetMinutes != null) {
    const shift = (src.tzOffsetMinutes ?? 0) * 60000
    const d = new Date(now + shift)
    return {
      H: d.getUTCHours(),
      M: d.getUTCMinutes(),
      S: d.getUTCSeconds(),
      ms: d.getUTCMilliseconds(),
    }
  } else {
    const d = new Date(now)
    return {
      H: d.getHours(),
      M: d.getMinutes(),
      S: d.getSeconds(),
      ms: d.getMilliseconds(),
    }
  }
}

function timeAngleRad(parts: {H:number;M:number;S:number;ms:number}, hand: 'second' | 'minute' | 'hour', format: 12|24, smooth: boolean): number {
  const {H,M,S,ms} = parts
  if (hand === 'second') {
    const s = S + (smooth ? ms/1000 : 0)
    return (2*Math.PI) * (s/60)
  }
  if (hand === 'minute') {
    const m = M + (smooth ? S/60 : 0)
    return (2*Math.PI) * (m/60)
  }
  // hour
  const h = (format === 24)
    ? (H + (smooth ? M/60 + S/3600 : 0)) / 24
    : (((H % 12) + (smooth ? M/60 + S/3600 : 0)) / 12)
  return (2*Math.PI) * h
}

export function buildClock(app: Application, built: BuiltLayer[]) {
  const items: ClockItem[] = []
  for (const b of built) {
    const clk = b.cfg.clock
    if (!clk || !clk.enabled) continue
    const overrideSpin = !!clk.overrideSpin
    const handSpin = (clk.handSpin ?? clk.hand ?? 'second')
    const handOrbit = (clk.handOrbit ?? clk.hand ?? 'second')
    const format = (clk.format === 24 ? 24 : 12) as 12|24
    const smooth = clk.smooth ?? true
    const tipRad = toRad((clk.tipDeg ?? 90))
    const source: TimeSource = { mode: clk.source?.mode ?? 'device', tzOffsetMinutes: clk.source?.tzOffsetMinutes ?? null }
    const baseAngleRad = toRad(b.cfg.angleDeg ?? 0)
    const overrideOrbit = !!clk.overrideOrbit
    const item: ClockItem = { sprite: b.sprite, cfg: b.cfg, handSpin, handOrbit, format, overrideSpin, smooth, tipRad, source, baseAngleRad, overrideOrbit }
    if (overrideOrbit) {
      // derive orbit geometry (reusing orbit semantics)
      const c = b.cfg.orbitCenter || { xPct: 50, yPct: 50 }
      const centerPct = { x: Math.max(0, Math.min(100, c.xPct ?? 50)), y: Math.max(0, Math.min(100, c.yPct ?? 50)) }
      const w = app.renderer.width
      const h = app.renderer.height
      const cx = w * (centerPct.x / 100)
      const cy = h * (centerPct.y / 100)
      const bx = w * ((b.cfg.position.xPct ?? 0) / 100)
      const by = h * ((b.cfg.position.yPct ?? 0) / 100)
      const start = projectToRectBorder(cx, cy, bx, by, w, h)
      const r = Math.hypot(start.x - cx, start.y - cy)
      item.centerPct = centerPct
      item.centerPx = { cx, cy }
      item.radius = r
    }
    items.push(item)
  }

  function tick() {
    if (items.length === 0) return
    // Compute parts once per source mode to avoid multiple Date creations
    // For simplicity, compute per-item; cost is minimal.
    for (const it of items) {
      const parts = getTimeParts(it.source)
      const angSpin = timeAngleRad(parts, it.handSpin, it.format, it.smooth)
      const angOrbit = timeAngleRad(parts, it.handOrbit, it.format, it.smooth)
      // Rotation override
      if (it.overrideSpin) {
        const finalRot = it.baseAngleRad + it.tipRad + angSpin
        it.sprite.rotation = finalRot
      }
      // Orbit override (position)
      if (it.overrideOrbit && it.radius && it.centerPx) {
        const cx = it.centerPx.cx
        const cy = it.centerPx.cy
        it.sprite.x = cx + it.radius * Math.cos(angOrbit)
        it.sprite.y = cy + it.radius * Math.sin(angOrbit)
      }
    }
  }

  function recompute() {
    // Re-evaluate center/radius to keep geometry in sync on resize
    const w = (items[0]?.sprite as any)?.renderer?.width ?? undefined
    // We can't reliably access renderer from sprite; use DOM size via app renderer passed in outer scope instead.
    // Consumers should call recompute with access to app sizes; we will approximate using window as fallback.
  }

  return { items, tick, recompute: () => {
      const ww = (window as any).innerWidth
      const hh = (window as any).innerHeight
      for (const it of items) {
        if (!it.overrideOrbit || !it.centerPct) continue
        const cx = ww * ((it.centerPct.x ?? 50) / 100)
        const cy = hh * ((it.centerPct.y ?? 50) / 100)
        const bx = ww * ((it.cfg.position.xPct ?? 0) / 100)
        const by = hh * ((it.cfg.position.yPct ?? 0) / 100)
        const start = projectToRectBorder(cx, cy, bx, by, ww, hh)
        it.centerPx = { cx, cy }
        it.radius = Math.hypot(start.x - cx, start.y - cy)
      }
    } }
}

function projectToRectBorder(cx: number, cy: number, x: number, y: number, w: number, h: number): { x: number; y: number } {
  if (x >= 0 && x <= w && y >= 0 && y <= h) return { x, y }
  const dx = x - cx
  const dy = y - cy
  if (dx === 0 && dy === 0) return { x: cx, y: cy }
  const eps = 1e-6
  const cand: { t: number; x: number; y: number }[] = []
  if (Math.abs(dx) > eps) {
    const t1 = (0 - cx) / dx
    const y1 = cy + t1 * dy
    if (t1 > 0 && y1 >= -1 && y1 <= h + 1) cand.push({ t: t1, x: 0, y: y1 })
    const t2 = (w - cx) / dx
    const y2 = cy + t2 * dy
    if (t2 > 0 && y2 >= -1 && y2 <= h + 1) cand.push({ t: t2, x: w, y: y2 })
  }
  if (Math.abs(dy) > eps) {
    const t3 = (0 - cy) / dy
    const x3 = cx + t3 * dx
    if (t3 > 0 && x3 >= -1 && x3 <= w + 1) cand.push({ t: t3, x: x3, y: 0 })
    const t4 = (h - cy) / dy
    const x4 = cx + t4 * dx
    if (t4 > 0 && x4 >= -1 && x4 <= w + 1) cand.push({ t: t4, x: x4, y: h })
  }
  if (cand.length === 0) return { x: Math.max(0, Math.min(w, x)), y: Math.max(0, Math.min(h, y)) }
  cand.sort((a, b) => a.t - b.t)
  return { x: cand[0].x, y: cand[0].y }
}
