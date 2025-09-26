import { Assets, Container, Sprite } from 'pixi.js'
import type { Application } from 'pixi.js'
import type { BuiltLayer, BuildResult, LogicConfig, LayerConfig } from '../logic/LogicTypes'
import { logicApplyBasicTransform, logicZIndexFor, sortLayersForRender } from './LayerPlacement'
import { buildSpin, tickSpin } from '../logic/LogicLoaderSpin'
import { buildOrbit } from '../logic/LogicLoaderOrbit'

export function resolveLayerImageUrl(cfg: LogicConfig, layer: LayerConfig): string | null {
  const ref = layer.imageRef
  if (ref.kind === 'url') return ref.url
  const url = cfg.imageRegistry[ref.id]
  return url ?? null
}

export async function createLayerSprite(
  app: Application,
  cfg: LogicConfig,
  layer: LayerConfig
): Promise<BuiltLayer | null> {
  const url = resolveLayerImageUrl(cfg, layer)
  if (!url) {
    console.warn('[logic] Missing image URL for layer', layer.id, layer.imageRef)
    return null
  }

  try {
    const texture = await Assets.load(url)
    const sprite = new Sprite(texture)
    sprite.anchor.set(0.5)
    logicApplyBasicTransform(app, sprite, layer)
    sprite.zIndex = logicZIndexFor(layer)
    return { id: layer.id, sprite, cfg: layer }
  } catch (e) {
    console.error('[logic] Failed to load', url, 'for layer', layer.id, e)
    return null
  }
}

export async function createLogicScene(app: Application, cfg: LogicConfig): Promise<BuildResult> {
  const container = new Container()
  container.sortableChildren = true

  const layers = sortLayersForRender(cfg.layers)
  const built: BuiltLayer[] = []

  const urlSet = new Set<string>()
  for (const layer of layers) {
    const url = resolveLayerImageUrl(cfg, layer)
    if (url) urlSet.add(url)
  }

  await Promise.all(
    Array.from(urlSet).map((url) =>
      Assets.load(url).catch((e) => {
        console.warn('[logic] Preload failed for', url, e)
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

  const { items: spinItems, rpmBySprite: spinRpmBySprite } = buildSpin(app, built)
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
    tickSpin(spinItems, elapsed)
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
