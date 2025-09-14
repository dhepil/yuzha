import React from 'react'
import { readSbEnvOrThrow } from '@shared/utils/sbEnv'
import { makeEdgeClient } from '@shared/utils/sbEdge'
import { getAccessToken } from '../services/supabaseClient'

export type LogicApiTesterProps = {
  visible: boolean
}

export default function LogicApiTester(props: LogicApiTesterProps) {
  const [busy, setBusy] = React.useState(false)
  const [msg, setMsg] = React.useState<string | null>(null)

  if (!props.visible) return null

  const onTest = async () => {
    setBusy(true)
    setMsg(null)
    try {
      const env = readSbEnvOrThrow('Launcher')
      const edge = makeEdgeClient(env)
      const token = await getAccessToken() // may be null; health does not require auth
      const r = await edge.call('auth/health', undefined, { method: 'GET', accessToken: token ?? undefined })
      if (r.ok) {
        setMsg('OK: ' + JSON.stringify(r.data))
      } else {
        setMsg('ERR ' + r.status + ': ' + (r.error?.message ?? 'Unknown'))
      }
    } catch (e: any) {
      setMsg('ERR: ' + (e?.message || String(e)))
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="fixed top-9 right-16 z-[9998] flex items-center gap-2">
      <button
        type="button"
        onClick={onTest}
        disabled={busy}
        className="text-[10px] px-2 py-0.5 rounded bg-emerald-600/80 hover:bg-emerald-500/80 active:bg-emerald-600 text-white shadow-sm border border-white/10"
        aria-label="Test Edge Function"
      >
        {busy ? 'Testing…' : 'Test API'}
      </button>
      {msg && (
        <span className="pointer-events-none select-none text-[10px] text-white/80 bg-black/60 px-2 py-0.5 rounded border border-white/10 max-w-[40ch] truncate" title={msg}>
          {msg}
        </span>
      )}
    </div>
  )
}

