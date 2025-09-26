import React from 'react'
import type { Application, Container } from 'pixi.js'
import { PixiCore, PixiCoreConfiguration } from '@shared/pixi'

type PixiCoreOptions = ConstructorParameters<typeof PixiCoreConfiguration>[0]

type StageSceneFactory<Cfg, Result extends { container: Container }> = (
  app: Application,
  cfg: Cfg
) => Promise<Result>

type StageHostProps<Cfg, Result extends { container: Container }> = {
  config: Cfg
  createScene: StageSceneFactory<Cfg, Result>
  className?: string
  coreOptions?: PixiCoreOptions
  onError?: (error: unknown) => void
}

export default function StageHost<Cfg, Result extends { container: Container }>(props: StageHostProps<Cfg, Result>) {
  const { config, createScene, className, coreOptions, onError } = props
  const ref = React.useRef<HTMLDivElement | null>(null)
  const [error, setError] = React.useState<string | null>(null)
  const sceneCleanupRef = React.useRef<(() => void) | null>(null)
  const pixiCoreRef = React.useRef<PixiCore | null>(null)

  React.useEffect(() => {
    const el = ref.current
    if (!el) return
    let mounted = true

    ;(async () => {
      try {
        const configInstance = new PixiCoreConfiguration(coreOptions)
        const core = PixiCore.getInstance(configInstance)
        pixiCoreRef.current = core

        if (!mounted) return
        core.mount(el)

        const pixiInstance = core.getPixiInstance()
        const scene = await createScene(pixiInstance.app, config)

        if (!mounted) {
          scene.container.destroy({ children: true })
          return
        }

        core.addToStage(scene.container)

        sceneCleanupRef.current = () => {
          try {
            const container = scene.container as any
            if (typeof container._cleanup === 'function') container._cleanup()
            scene.container.destroy({ children: true })
          } catch (cleanupError) {
            console.warn('[StageHost] Cleanup error:', cleanupError)
          }
        }
      } catch (e) {
        if (!mounted) return
        onError?.(e)
        const message = e instanceof Error ? e.message : 'Unknown error'
        console.error('[StageHost] Failed to build scene:', e)
        setError(`Failed to initialize stage: ${message}`)
      }
    })()

    return () => {
      mounted = false
      try { sceneCleanupRef.current?.() } catch {}
      try { pixiCoreRef.current?.destroy() } catch {}
      sceneCleanupRef.current = null
      pixiCoreRef.current = null
    }
  }, [config, createScene, coreOptions, onError])

  if (error) {
    return (
      <div className={`w-full h-full flex items-center justify-center text-red-500 ${className ?? ''}`}>
        {error}
      </div>
    )
  }

  return <div ref={ref} className={className ?? 'w-full h-full'} />
}
