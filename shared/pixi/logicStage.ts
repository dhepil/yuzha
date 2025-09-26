import type { Application, Container } from 'pixi.js';
import {
  PixiStageAdapter,
  type PixiStageAdapterOptions
} from './stage-pixi-adapter';

export type StageSceneFactory<Cfg, Result extends { container: Container }> = (
  app: Application,
  cfg: Cfg
) => Promise<Result>;

export type StageMountHandle = {
  dispose(): void;
};

export async function mountStage<Cfg, Result extends { container: Container }>(
  root: HTMLElement,
  cfg: Cfg,
  createScene: StageSceneFactory<Cfg, Result>,
  opts?: PixiStageAdapterOptions
): Promise<StageMountHandle> {
  const stageAdapter = new PixiStageAdapter(opts);
  const { app } = await stageAdapter.mount(root);

  let sceneContainer: Container | null = null;
  try {
    const scene = await createScene(app, cfg);
    sceneContainer = scene.container;
    app.stage.addChild(sceneContainer);
  } catch (e) {
    console.error('[Stage] Failed to mount scene', e);
  }

  return {
    dispose() {
      try {
        if (sceneContainer) {
          try { (sceneContainer as any)._cleanup?.() } catch {}
          try { sceneContainer.removeFromParent() } catch {}
          try { sceneContainer.destroy({ children: true }) } catch {}
        }
      } finally {
        stageAdapter.dispose();
      }
    }
  };
}
