import React from 'react'
import type { LogicConfig, LayerConfig } from './sceneTypes'
import cfgJson from './LogicConfig'
import { clamp, clamp01, clampRpm60, toRad } from './LogicMath'
import { logicZIndexFor } from './LogicLoaderBasic'

type ImgItem = {
  el: HTMLImageElement
  cfg: LayerConfig
  // spin
  spinRadPerSec: number
  spinDir: 1 | -1
  baseRad: number
  // orbit
  orbitRadPerSec: number
  orbitDir: 1 | -1
  centerPct: { x: number; y: number }
  centerPx: { cx: number; cy: number }
  radius: number
  basePhase: number
  orientPolicy: 'none' | 'auto' | 'override'
  orientDegRad: number
}

function urlForImageRef(cfg: LogicConfig, ref: LayerConfig['imageRef']): string | null {
  if (ref.kind === 'url') return ref.url
  return cfg.imageRegistry[ref.id] ?? null
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
  if (cand.length === 0) return { x: clamp(x, 0, w), y: clamp(y, 0, h) }
  cand.sort((a, b) => a.t - b.t)
  const first = cand[0];
  if (!first) {
    return { x: clamp(x, 0, w), y: clamp(y, 0, h) };
  }
  return { x: first.x, y: first.y }
}

export default function LogicStageDom() {
  const rootRef = React.useRef<HTMLDivElement | null>(null)
  const imgsRef = React.useRef<ImgItem[]>([])
  const cfg = cfgJson as unknown as LogicConfig

  React.useEffect(() => {
    const root = rootRef.current
    if (!root) return
    root.style.position = 'relative'

    // No pointer tracking in this version

    // Build images
    const items: ImgItem[] = []
    const w = window.innerWidth
    const h = window.innerHeight

  for (const layer of cfg.layers) {
      const url = urlForImageRef(cfg, layer.imageRef)
      if (!url) continue
      const img = new Image()
      img.decoding = 'async'
      img.loading = 'lazy'
      img.draggable = false
      img.style.position = 'absolute'
      img.style.left = '0px'
      img.style.top = '0px'
      img.style.willChange = 'transform'
      img.style.pointerEvents = 'none'
      img.style.zIndex = String(logicZIndexFor(layer))

      root.appendChild(img)

      // spin
      const sRpm = clampRpm60(layer.spinRPM)
      const spinDir: 1 | -1 = layer.spinDir === 'ccw' ? -1 : 1
      const spinRadPerSec = (sRpm * Math.PI) / 30
      const baseRad = toRad(layer.angleDeg ?? 0)

      // orbit
      const oRpm = clampRpm60(layer.orbitRPM)
      const orbitDir: 1 | -1 = layer.orbitDir === 'ccw' ? -1 : 1
      const orbitRadPerSec = (oRpm * Math.PI) / 30
      const orbitCenterSeed = layer.orbitCenter ?? { xPct: 50, yPct: 50 }
      const centerPct = { x: clamp(orbitCenterSeed.xPct ?? 50, 0, 100), y: clamp(orbitCenterSeed.yPct ?? 50, 0, 100) }
      const cx = w * (centerPct.x / 100)
      const cy = h * (centerPct.y / 100)
      const bx = w * ((layer.position.xPct ?? 0) / 100)
      const by = h * ((layer.position.yPct ?? 0) / 100)
      const start = projectToRectBorder(cx, cy, bx, by, w, h)
      const radius = Math.hypot(start.x - cx, start.y - cy)
      const orientPolicy = (layer.orbitOrientPolicy ?? 'none') as 'none' | 'auto' | 'override'
      const orientDeg = typeof layer.orbitOrientDeg === 'number' && isFinite(layer.orbitOrientDeg) ? layer.orbitOrientDeg : 0
      const orientDegRad = toRad(orientDeg)
      const phaseDeg = layer.orbitPhaseDeg
      const basePhase = typeof phaseDeg === 'number' && isFinite(phaseDeg)
        ? toRad(((phaseDeg % 360) + 360) % 360)
        : Math.atan2(start.y - cy, start.x - cx)

      // No effects in this version

      items.push({
        el: img,
        cfg: layer,
        spinRadPerSec,
        spinDir,
        baseRad,
        orbitRadPerSec,
        orbitDir,
        centerPct,
        centerPx: { cx, cy },
        radius,
        basePhase,
        orientPolicy,
        orientDegRad
      })
    }

    imgsRef.current = items

    let elapsed = 0
    let raf = 0
    const tick = () => {
      raf = requestAnimationFrame(tick)
      const dt = 1 / 60 // simple steady clock
      elapsed += dt
      const ww = window.innerWidth
      const hh = window.innerHeight

      for (const it of imgsRef.current) {
        // Orbit position
        let x = ww * ((it.cfg.position.xPct ?? 0) / 100)
        let y = hh * ((it.cfg.position.yPct ?? 0) / 100)
        let angle = it.baseRad
        let s = (it.cfg.scale?.pct ?? 100) / 100
        let alphaMul = 1

        if (it.orbitRadPerSec > 0 && it.radius > 0) {
          const cx = ww * (clamp01(it.centerPct.x / 100))
          const cy = hh * (clamp01(it.centerPct.y / 100))
          const tAngle = it.basePhase + it.orbitDir * it.orbitRadPerSec * elapsed
          x = cx + it.radius * Math.cos(tAngle)
          y = cy + it.radius * Math.sin(tAngle)
          if (it.orientPolicy === 'override' || (it.orientPolicy === 'auto' && it.spinRadPerSec <= 0)) {
            angle = tAngle + it.orientDegRad
          }
        }

                  if (!(it.orientPolicy === 'override' || (it.orientPolicy === 'auto' && it.spinRadPerSec <= 0))) {
            if (it.spinRadPerSec > 0) {
              angle = it.baseRad + it.spinDir * it.spinRadPerSec * elapsed
            }
          }

        // No effects in this version

        it.el.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%) rotate(${(angle * 180) / Math.PI}deg) scale(${s})`
        it.el.style.opacity = String(alphaMul)
      }
    }
    raf = requestAnimationFrame(tick)

    const onResize = () => {
      // Recompute orbit geometry
      const ww = window.innerWidth
      const hh = window.innerHeight
      for (const it of imgsRef.current) {
        const cx = ww * (clamp01(it.centerPct.x / 100))
        const cy = hh * (clamp01(it.centerPct.y / 100))
        const bx = ww * ((it.cfg.position.xPct ?? 0) / 100)
        const by = hh * ((it.cfg.position.yPct ?? 0) / 100)
        const start = projectToRectBorder(cx, cy, bx, by, ww, hh)
        const r = Math.hypot(start.x - cx, start.y - cy)
        it.centerPx = { cx, cy }
        it.radius = r
        // Continuity approximation: leave basePhase unchanged; next tick will update position smoothly
      }
    }
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
      for (const it of imgsRef.current) {
        try { root.removeChild(it.el) } catch {}
      }
      imgsRef.current = []
    }
  }, [cfg])

  return <div ref={rootRef} className="w-screen h-screen" />
}




