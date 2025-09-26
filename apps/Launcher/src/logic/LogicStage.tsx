import React from 'react';
import { PixiCore, PixiCoreConfiguration } from '@shared/pixi';
import { buildSceneFromLogic } from './logicLoader';
import type { LogicConfig } from './sceneTypes';
import type { BuildResult } from './logicLoader';
import logicConfigJson from './LogicConfig';

export default function LogicStage() {
  const ref = React.useRef<HTMLDivElement | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const sceneCleanupRef = React.useRef<(() => void) | null>(null);
  const pixiCoreRef = React.useRef<PixiCore | null>(null);

  React.useEffect(() => {
    let mounted = true;

    (async () => {
      const el = ref.current;
      if (!el) return;

      try {
        // Create PixiCore instance with configuration
        const config = new PixiCoreConfiguration({
          width: 2048,
          height: 2048,
          backgroundAlpha: 0,
          antialias: true,
          autoDensity: true,
          resolution: window.devicePixelRatio || 1
        });

        const core = PixiCore.getInstance(config);
        pixiCoreRef.current = core;

        if (!mounted) return;
        core.mount(el);

        // Build and add the scene
        const cfg = logicConfigJson as LogicConfig;
        const pixiInstance = core.getPixiInstance();
        const scene = await buildSceneFromLogic(pixiInstance.app, cfg);
        
        if (!mounted) {
          scene.container.destroy({ children: true });
          return;
        }

        core.addToStage(scene.container);

        // Store cleanup function
        sceneCleanupRef.current = () => {
          try {
            const container = scene.container as any;
            if (typeof container._cleanup === 'function') {
              container._cleanup();
            }
            scene.container.destroy({ children: true });
          } catch (err) {
            console.warn('[LogicStage] Cleanup error:', err);
          }
        };
      } catch (e) {
        if (!mounted) return;
        const errorMessage = e instanceof Error ? e.message : 'Unknown error';
        console.error('[LogicStage] Failed to build scene:', e);
        setError(`Failed to initialize stage: ${errorMessage}`);
      }
    })();

    return () => {
      mounted = false;
      try { sceneCleanupRef.current?.() } catch {}
      try { pixiCoreRef.current?.destroy() } catch {}
      sceneCleanupRef.current = null;
      pixiCoreRef.current = null;
    };
  }, []);

  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div ref={ref} className="w-full h-full" />
  );
}


