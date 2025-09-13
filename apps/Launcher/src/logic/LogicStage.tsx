import React from 'react'
import { Application } from 'pixi.js'
import { buildSceneFromLogic } from './logicLoader'
import type { LogicConfig } from './sceneTypes'
import logicConfigJson from './LogicConfig'

export default function LogicStage() {
  const ref = React.useRef<HTMLDivElement | null>(null)

  React.useEffect(() => {
    const app = new Application({
      resizeTo: window,
      backgroundAlpha: 0,
      antialias: true
    })

    const el = ref.current
    if (!el) {
      app.destroy(true, { children: true, texture: true, baseTexture: true })
      return
    }

    el.appendChild(app.view as HTMLCanvasElement)

    let cleanupScene: (() => void) | undefined

    ;(async () => {
      try {
        const cfg = logicConfigJson as unknown as LogicConfig
        const scene = await buildSceneFromLogic(app, cfg)
        app.stage.addChild(scene.container)
        cleanupScene = () => {
          try { (scene.container as any)._cleanup?.() } catch {}
          try { scene.container.destroy({ children: true }) } catch {}
        }
      } catch (e) {
        console.error('[LogicStage] Failed to build scene from logic config', e)
      }
    })()

    return () => {
      try { cleanupScene?.() } catch {}
      try {
        if (el.contains(app.view as HTMLCanvasElement)) el.removeChild(app.view as HTMLCanvasElement)
      } catch {}
      app.destroy(true, { children: true, texture: true, baseTexture: true })
    }
  }, [])

  return (
    <div ref={ref} className="w-screen h-screen" />
  )
}

