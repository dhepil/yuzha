import { Assets, Container } from 'pixi.js'
import type { Application } from 'pixi.js'
import type { LogicConfig } from './LogicTypes'
import { logicApplyBasicTransform, sortLayersForRender } from '../function/LayerPlacement'
import { buildSpin, tickSpin } from './LogicLoaderSpin'
import { buildOrbit } from './LogicLoaderOrbit'
import type { BuiltLayer, BuildResult } from './LogicTypes'
import {
  createLayerSprite,
  resolveLayerImageUrl
} from '../function/LayerCreator'

// z-index and base transforms are delegated to Basic processor helpers

export async function buildSceneFromLogic(app: Application, cfg: LogicConfig): Promise<BuildResult> {
  const container = new Container()
  container.sortableChildren = true

  // Sort layers by z-index then id fallback, to define render order
  const layers = sortLayersForRender(cfg.layers)

  const built: BuiltLayer[] = []

  // Prefetch assets in parallel to avoid sequential fetch latency
  const urlSet = new Set<string>()
  for (const layer of layers) {
    const u = resolveLayerImageUrl(cfg, layer)
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
    const builtLayer = await createLayerSprite(app, cfg, layer)
    if (!builtLayer) continue
    container.addChild(builtLayer.sprite)
    built.push(builtLayer)
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
