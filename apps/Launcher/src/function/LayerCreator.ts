import { Assets, Sprite } from 'pixi.js'
import type { Application } from 'pixi.js'
import type { BuiltLayer, LogicConfig, LayerConfig } from '../logic/LogicTypes'
import { logicApplyBasicTransform, logicZIndexFor } from '../logic/LogicLoaderBasic'

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
