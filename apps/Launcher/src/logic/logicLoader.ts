import { Assets, Container, Sprite } from 'pixi.js'
import type { Application } from 'pixi.js'
import type { LogicConfig, LayerConfig } from './sceneTypes'
import { logicApplyBasicTransform, logicZIndexFor } from './LogicLoaderBasic'
import { buildSpin, tickSpin } from './LogicLoaderSpin'
import { buildOrbit } from './LogicLoaderOrbit'
import type { BuiltLayer, BuildResult } from './LogicTypes'

function getUrlForImageRef(cfg: LogicConfig, ref: LayerConfig['imageRef']): string | null {
  if (ref.kind === 'url') return ref.url
  const url = cfg.imageRegistry[ref.id]
  return url ?? null
}

// z-index and base transforms are delegated to Basic processor helpers

export async function buildSceneFromLogic(app: Application, cfg: LogicConfig): Promise<BuildResult> {
  const container = new Container()
  container.sortableChildren = true

  // Sort layers by z-index then id fallback, to define render order
  const layers = [...cfg.layers].sort((a, b) => {
    const za = logicZIndexFor(a); const zb = logicZIndexFor(b)
    if (za !== zb) return za - zb
    return a.id.localeCompare(b.id)
  })

  const built: BuiltLayer[] = []

  // Prefetch assets in parallel to avoid sequential fetch latency
  const urlSet = new Set<string>()
  for (const layer of layers) {
    const u = getUrlForImageRef(cfg, layer.imageRef)
    if (u) urlSet.add(u)
  }
  
  await Promise.all(
    Array.from(urlSet).map((u) =>
      Assets.load(u).catch((e) => {
        console.warn('[logic] Preload failed for', u, e)
        return null
      })
    )
  )

  for (const layer of layers) {

    const url = getUrlForImageRef(cfg, layer.imageRef)
    if (!url) {
      console.warn('[logic] Missing image URL for layer', layer.id, layer.imageRef)
      continue
    }
    try {
      // Texture should be cached from prefetch; load again if needed
      const texture = await Assets.load(url)
      const sprite = new Sprite(texture)
      sprite.anchor.set(0.5)
      logicApplyBasicTransform(app, sprite, layer)
      // Set zIndex from ID-derived order only
      sprite.zIndex = logicZIndexFor(layer)
      container.addChild(sprite)
      built.push({ id: layer.id, sprite, cfg: layer })
    } catch (e) {
      console.error('[logic] Failed to load', url, 'for layer', layer.id, e)
    }
  }

  // Spin runtime: build items and map (no behavior change)
  const { items: spinItems, rpmBySprite: spinRpmBySprite } = buildSpin(app, built)
  // Orbit runtime: build items and helpers
  const orbit = buildOrbit(app, built, spinRpmBySprite)
  let elapsed = 0
  const onResize = () => {
    for (const b of built) logicApplyBasicTransform(app, b.sprite, b.cfg)
    orbit.recompute(elapsed)
  }
  const resizeListener = () => onResize()
  window.addEventListener('resize', resizeListener)

  const tick = () => {
    if (spinItems.length === 0 && orbit.items.length === 0) return
    const dt = (app.ticker.deltaMS || 16.667) / 1000
    elapsed += dt
    // Spin
    tickSpin(spinItems, elapsed)
    // Orbit
    orbit.tick(elapsed)
  }
  if (spinItems.length > 0 || orbit.items.length > 0) {
    app.ticker.add(tick)
  }

  const prevCleanup = (container as any)._cleanup as (() => void) | undefined
  ;(container as any)._cleanup = () => {
    window.removeEventListener('resize', resizeListener)
    if (spinItems.length > 0 || orbit.items.length > 0) {
      app.ticker.remove(tick)
    }
    prevCleanup?.()
  }

  return { container, layers: built }
}

