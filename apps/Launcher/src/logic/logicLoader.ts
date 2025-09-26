import type { Application } from 'pixi.js'
import type { LogicConfig } from './LogicTypes'
import type { BuildResult } from './LogicTypes'
import { createLogicScene } from '../function/LayerCreator'

export async function buildSceneFromLogic(app: Application, cfg: LogicConfig): Promise<BuildResult> {
  return createLogicScene(app, cfg)
}
