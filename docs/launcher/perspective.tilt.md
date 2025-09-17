# Perspective Tilt Effect Plan

## Goal
Add a new clock effect that mimics a perspective "laydown" ring (foreshortened circle) while keeping the current tilt wobble for parallax.

## Current State
- Config supports `effects[{ type: "tilt", mode, axis, maxDeg, periodMs }]` which only rotates around the Z-axis.
- Pixi pipeline: `LogicLoaderEffects.ts` adds pointer/time-driven rotation offsets.
- DOM fallback mirrors the rotation-only behaviour.
- No support for texture skew/perspective in either renderer.

## Constraints
- Must preserve existing behaviour for scenes that rely on `tilt`.
- Should degrade gracefully in DOM fallback (e.g., static texture or simplified rotation).
- Keep asset resolution pipeline untouched (no new loaders unless necessary).

## Phase Plan

### Phase 1 – Research & Design
- Review Pixi options: MeshGeometry + shader, Sprite3D (pixi-projection), or pre-rendered angled textures.
- Decide on approach balancing performance and ease of integration.
- Document matrix math or asset requirements in this file.

### Phase 2 – Schema & Config
- Extend `sceneTypes.ts` with a new effect type, e.g., `perspectiveTilt`.
- Update JSON samples (`LogicConfig.json`, docs) with default parameters (angle, squash factor, pointer influence).
- Keep legacy `tilt` intact.

### Phase 3 – Pixi Implementation
- Implement the chosen transform inside `LogicLoaderEffects.ts` or a dedicated module.
- Ensure compatibility with clock overrides and other effects (spin, glow, orbit).
- Add debug logging behind `VITE_CLOCK_DEBUG` for the new effect.

### Phase 4 – DOM Fallback Strategy
- If full perspective is infeasible in DOM, use a backup (static angled sprite or simple rotation).
- Emit warnings when falling back, so QA can spot the difference.

### Phase 5 – Testing
- `npm run typecheck:launcher`
- `npm run build:launcher`
- Manual verification in dev and Netlify preview across browsers.
- Confirm pointer/time modes behave consistently.

### Phase 6 – Documentation & Cleanup
- Update `user.config.md` with parameters and examples.
- Remove temporary toggles once stable.
- Capture lessons learned in this file.

## Open Questions
- Can we rely on pixi-projection (extra dependency) or should we stay with vanilla Pixi?
- What assets are needed for DOM fallback (separate pre-rendered textures?).
- Does the effect need pointer input or just a static perspective shift?

## Next Actions
- Confirm desired behaviour with stakeholders (static angled ring vs interactive parallax).
- Prototype two approaches (mesh vs pre-render) to compare.
- Update this plan with findings before coding.
