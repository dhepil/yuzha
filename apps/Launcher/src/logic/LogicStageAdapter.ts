import type { Container } from 'pixi.js'
import type { LogicConfig } from './LogicTypes'
import { createLogicScene } from '../function/LayerCreator'
import {
  PixiStageAdapter,
  type PixiStageAdapterOptions
} from '@shared/pixi/stage-pixi-adapter'

export type LogicStageOptions = PixiStageAdapterOptions

export type LogicStageHandle = {
  dispose(): void
}

export async function mountLogicStage(
  root: HTMLElement,
  cfg: LogicConfig,
  opts?: LogicStageOptions
): Promise<LogicStageHandle> {
  const stageAdapter = new PixiStageAdapter(opts)
  const { app } = await stageAdapter.mount(root)

  let sceneContainer: Container | null = null
  try {
    const scene = await createLogicScene(app, cfg)
    sceneContainer = scene.container
    app.stage.addChild(sceneContainer)
  } catch (e) {
    console.error('[LogicStage] Failed to mount scene', e)
  }

  return {
    dispose() {
      try {
        if (sceneContainer) {
          try { (sceneContainer as any)._cleanup?.() } catch {}
          try {
            sceneContainer.removeFromParent()
          } catch {}
          try {
            sceneContainer.destroy({ children: true })
          } catch {}
        }
      } finally {
        stageAdapter.dispose()
      }
    }
  }
}
