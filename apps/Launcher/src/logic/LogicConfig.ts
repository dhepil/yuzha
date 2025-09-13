import type { LogicConfig } from './sceneTypes'
// Temporary shim: expose config from original location under the new logic/ path
// Phase 6 keeps behavior identical while callers migrate imports.
// Later we can physically move the JSON into this folder.
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore - JSON import without type
import cfg from './LogicConfig.json'

export default cfg as LogicConfig
