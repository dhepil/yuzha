import type { Application, Sprite } from 'pixi.js'
import type { BuiltLayer } from './LogicTypes'
import { clampRpm60 } from './LogicMath'

/**
 * Represents a spinning sprite with its rotation properties
 */
export type SpinItem = {
  sprite: Sprite;
  baseRad: number;
  radPerSec: number;
  dir: 1 | -1;
}

/**
 * Builds the spin animation configuration for a set of layers
 * @param app The PIXI Application instance
 * @param built Array of built layers to process
 * @returns Object containing spin items and RPM mapping
 */
export function buildSpin(_app: Application, built: BuiltLayer[]) {
  const items: SpinItem[] = []
  const rpmBySprite = new Map<Sprite, number>()

  for (const b of built) {
    // Process spin configuration
    const rpm = clampRpm60(b.cfg.spinRPM)
    rpmBySprite.set(b.sprite, rpm)

    // Skip if no spin needed
    if (rpm <= 0) continue

    const dir = (b.cfg.spinDir === 'ccw') ? -1 : (1 as 1 | -1)
    const baseRad = b.sprite.rotation || 0 // Ensure valid initial rotation
    const radPerSec = (rpm * Math.PI) / 30 // Convert RPM to radians/second

    items.push({ sprite: b.sprite, baseRad, radPerSec, dir })
  }

  return { items, rpmBySprite }
}

/**
 * Updates the rotation of spinning sprites based on elapsed time
 * @param items Array of SpinItem objects to update
 * @param elapsed Total elapsed time in seconds
 */
export function tickSpin(items: SpinItem[], elapsed: number) {
  if (!items?.length) return

  for (const it of items) {
    if (!it.sprite) continue
    it.sprite.rotation = it.baseRad + it.dir * it.radPerSec * elapsed
  }
}
