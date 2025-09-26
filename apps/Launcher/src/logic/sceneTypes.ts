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
