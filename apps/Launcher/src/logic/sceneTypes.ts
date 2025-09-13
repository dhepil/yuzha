export type ImageRegistry = Record<string, string>

export type ImageRef =
  | { kind: 'urlId'; id: string }
  | { kind: 'url'; url: string }

export type LayerConfig = {
  id: string
  imageRef: ImageRef
  position: { xPct: number; yPct: number }
  scale?: { pct?: number }
  angleDeg?: number
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
  // Clock (optional)
  clock?: {
    enabled?: boolean
    hand?: 'second' | 'minute' | 'hour' // default for both if specific hands not provided
    handSpin?: 'second' | 'minute' | 'hour'
    handOrbit?: 'second' | 'minute' | 'hour'
    format?: 12 | 24
    overrideSpin?: boolean
    overrideOrbit?: boolean // planned for next phase
    tipDeg?: number | null // default 90
    smooth?: boolean | null // default true
    source?: {
      mode?: 'device' | 'utc' | 'server'
      tzOffsetMinutes?: number | null
    }
  }
  // Visual effects (optional; Phase 1 supports fade/pulse only)
  effects?: Array<
    | {
        type: 'fade'
        from?: number // 0..1, default 1
        to?: number // 0..1, default 1
        durationMs?: number // default 1000
        loop?: boolean // default true (ping-pong)
        easing?: 'linear' | 'sineInOut' // default 'linear'
      }
    | {
        type: 'pulse'
        property?: 'scale' | 'alpha' // default 'scale'
        amp?: number // default 0.05 (5%) for scale, or 0.1 for alpha
        periodMs?: number // default 1000
        phaseDeg?: number // default 0
      }
    | {
        type: 'glow'
        color?: number // 0xRRGGBB
        alpha?: number // 0..1 default 0.4
        scale?: number // default 0.15 (relative extra scale)
        pulseMs?: number // optional pulsing period
      }
    | {
        type: 'bloom'
        strength?: number // default 0.6
        threshold?: number // default 0.5 (only for future real bloom)
      }
    | {
        type: 'distort'
        ampPx?: number // default 2 px of jitter
        speed?: number // default 0.5 cycles/sec
      }
    | {
        type: 'shockwave'
        periodMs?: number // default 1200
        maxScale?: number // default 1.3
        fade?: boolean // default true
      }
  >
}

export type LogicConfig = {
  layersID: string[]
  imageRegistry: ImageRegistry
  layers: LayerConfig[]
}
