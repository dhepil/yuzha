import type { LayerConfig } from '../logic/LogicTypes'
import { logicZIndexFor } from '../logic/LogicLoaderBasic'

export function sortLayersForRender(layers: LayerConfig[]): LayerConfig[] {
  return [...layers].sort((a, b) => {
    const za = logicZIndexFor(a)
    const zb = logicZIndexFor(b)
    if (za !== zb) return za - zb
    return a.id.localeCompare(b.id)
  })
}
