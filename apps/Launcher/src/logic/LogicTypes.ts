import type { Application, Container, Sprite } from 'pixi.js'

// Declarative logic scene configuration types

export type ImageRegistry = Record<string, string>

export type ImageRef =
  | { kind: 'urlId'; id: string }
  | { kind: 'url'; url: string }

export type LayerConfig = {
  id: string
  imageRef: ImageRef
  position: { xPct: number; yPct: number }
  scale?: { pct?: number }
  // Runtime animation (optional)
  spinRPM?: number | null
  spinDir?: 'cw' | 'ccw'
  // Orbit motion (optional)
  orbitRPM?: number | null
  orbitDir?: 'cw' | 'ccw'
  orbitCenter?: { xPct: number; yPct: number }
  orbitPhaseDeg?: number | null
  // Orbit orientation (optional, simplified)
  orbitOrientPolicy?: 'none' | 'auto' | 'override'
  orbitOrientDeg?: number | null
}

export type LogicConfig = {
  layersID: string[]
  imageRegistry: ImageRegistry
  layers: LayerConfig[]
}

// Minimal shared runtime types for the logic pipeline (hub + processors + adapters)

export type BuiltLayer = {
  id: string
  sprite: Sprite
  cfg: LayerConfig
}

export type BuildResult = {
  container: Container
  layers: BuiltLayer[]
}

export type BuildContext = {
  app: Application
  container: Container
  cfg: LogicConfig
  layers: BuiltLayer[]
}

export interface LogicProcessor {
  init(ctx: BuildContext): void
  onResize?(ctx: BuildContext): void
  tick?(dt: number, ctx: BuildContext): void
  dispose?(): void
}

export interface LogicAdapter<M = unknown> {
  mount(root: HTMLElement, model: M): void
  update?(model: M): void
  dispose(): void
}
