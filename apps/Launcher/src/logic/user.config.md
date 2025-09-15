# Logic Layer Configuration Reference

This file summarizes all layer config fields and effects with value ranges and defaults. Effects are opt-in; no change unless specified in JSON.

## Core
- `id` (string, required)
- `imageRef` { `kind`: "urlId"|"url", `id`?: string, `url`?: string }
- `position` { `xPct`: 0–100, `yPct`: 0–100 } (default 50,50)
- `scale` { `pct`: number } (default 100)
- `angleDeg` (number, default 0)

## Spin
- `spinRPM` (0–60, default 0)
- `spinDir` ("cw"|"ccw", default "cw")

## Orbit
- `orbitRPM` (0–60, default 0)
- `orbitDir` ("cw"|"ccw", default "cw")
- `orbitCenter` { `xPct`: 0–100, `yPct`: 0–100 } (default 50,50)
- `orbitPhaseDeg` (number|null, default null)
- `orbitOrientPolicy` ("none"|"auto"|"override", default "none")
- `orbitOrientDeg` (number, default 0)

## Clock
- `clock.enabled` (boolean, default false)
- `clock.hand` ("second"|"minute"|"hour") base default
- `clock.handSpin` (defaults to `hand`)
- `clock.handOrbit` (defaults to `hand`)
- `clock.format` (12|24, default 12)
- `clock.overrideSpin` (boolean, default false)
- `clock.overrideOrbit` (boolean, default false)
- `clock.tipDeg` (number, default 90)
- `clock.smooth` (boolean, default true)
- `clock.source` { `mode`: "device"|"utc"|"server" (default "device"), `tzOffsetMinutes`: number|null }

## Effects (Phase 1)
- `type: "fade"`
  - `from` 0–1 (default 1), `to` 0–1 (default 1), `durationMs` >0 (default 1000), `loop` (default true), `easing` ("linear"|"sineInOut", default "linear")
- `type: "pulse"`
  - `property` ("scale"|"alpha", default "scale"), `amp` (≈0.01–0.2; defaults: 0.05 scale, 0.1 alpha), `periodMs` >0 (default 1000), `phaseDeg` (default 0)

## Effects (Phase 2)
- `type: "glow"` { `color`: 0xRRGGBB (default 0xffff00), `alpha`: 0–1 (default 0.4), `scale`: number (default 0.15), `pulseMs`?: number }
- `type: "bloom"` { `strength`: 0–1 (default 0.6), `threshold` (reserved) }
- `type: "distort"` { `ampPx`: number (default 2), `speed`: number (default 0.5) }
- `type: "shockwave"` { `periodMs`: number (default 1200), `maxScale`: >1 (default 1.3), `fade`: boolean (default true) }

Notes: Advanced effects enable on capable devices; Phase 1 always works (Pixi & DOM).

### Tilt (Phase 1)
- `type: "tilt"`
  - Lightweight interactive rotation offset applied after spin/orbit/clock
  - `mode`: "pointer" | "time" | "device" (default "pointer")
  - `axis`: "both" | "x" | "y" (default "both"). Mapping: x→use vertical pointer, y→use horizontal pointer (negated), both→average
  - `maxDeg`: number (default 8)
  - `periodMs`: number (only for `mode: "time"`, default 4000)
