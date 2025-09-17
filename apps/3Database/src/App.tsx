import React, { useEffect, useMemo, useState } from 'react'
import { supabase } from './services/supabaseClient'
import { usePasskeySession } from '@shared/hooks/usePasskeySession'

const MODULE_NAME = '3Database'

type SubmissionRow = {
  id: string
  module_name: string
  submission_data: Record<string, unknown>
  created_at: string
}

export default function App() {
  const { status, session, error: authError, signIn, signOut } = usePasskeySession(supabase, { moduleId: 'm3_database' })
  const [passkey, setPasskey] = useState('')
  const [rows, setRows] = useState<SubmissionRow[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (status === 'authenticated') {
      void loadData()
    }
  }, [status])

  async function loadData() {
    setLoading(true)
    setError(null)
    const { data, error } = await supabase
      .from('module_submissions')
      .select('id, module_name, submission_data, created_at')
      .order('created_at', { ascending: false })
    if (error) setError(error.message)
    else setRows(data ?? [])
    setLoading(false)
  }

  const summary = useMemo(() => {
    const counts = new Map<string, number>()
    for (const row of rows) {
      counts.set(row.module_name, (counts.get(row.module_name) ?? 0) + 1)
    }
    return Array.from(counts.entries()).map(([module, total]) => ({ module, total }))
  }, [rows])

  if (status === 'checking') {
    return (
      <div className="app-shell flex items-center justify-center">
        <p className="text-neutral-400">Memeriksa sesi...</p>
      </div>
    )
  }

  if (status !== 'authenticated') {
    return (
      <div className="app-shell flex items-center justify-center">
        <div className="w-full max-w-sm space-y-4 rounded-xl border border-neutral-700 bg-neutral-900/80 p-6">
          <h1 className="text-xl font-semibold text-white">Masuk Modul DATABASE</h1>
          <p className="text-sm text-neutral-400">Analisis ringkas semua modul membutuhkan passkey.</p>
          <form
            className="space-y-3"
            onSubmit={async (event) => {
              event.preventDefault()
              await signIn(passkey)
            }}
          >
            <input
              type="password"
              className="w-full rounded-md border border-neutral-600 bg-neutral-800 px-3 py-2 text-white"
              placeholder="Passkey"
              value={passkey}
              onChange={(event) => setPasskey(event.target.value)}
            />
            <button
              type="submit"
              className="w-full rounded-md bg-violet-500 py-2 text-sm font-semibold text-white hover:bg-violet-400"
            >
              Masuk
            </button>
          </form>
          {authError && <p className="text-sm text-red-400">{authError}</p>}
        </div>
      </div>
    )
  }

  return (
    <div className="app-shell px-6 py-10 text-neutral-100">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-8">
        <header className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-semibold">DATABASE</h1>
            <p className="text-sm text-neutral-400">Ikhtisar semua data modul.</p>
            <p className="text-sm text-neutral-500 mt-1">Total entri: {rows.length}</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => loadData()}
              className="rounded-md border border-neutral-600 px-3 py-1 text-sm hover:bg-neutral-800"
              disabled={loading}
            >
              {loading ? 'Memuat...' : 'Refresh'}
            </button>
            <button
              onClick={() => signOut()}
              className="rounded-md border border-neutral-600 px-3 py-1 text-sm hover:bg-neutral-800"
            >
              Keluar
            </button>
          </div>
        </header>

        <section className="rounded-xl border border-neutral-700 bg-neutral-900/60 p-6">
          <h2 className="text-lg font-medium text-white">Ringkasan per Modul</h2>
          {summary.length === 0 ? (
            <p className="mt-3 text-sm text-neutral-500">Belum ada data tersimpan.</p>
          ) : (
            <table className="mt-4 w-full text-left text-sm">
              <thead className="text-neutral-400">
                <tr>
                  <th className="py-2">Modul</th>
                  <th className="py-2">Total Entri</th>
                </tr>
              </thead>
              <tbody>
                {summary.map((item) => (
                  <tr key={item.module} className="border-t border-neutral-700">
                    <td className="py-2 font-medium text-neutral-100">{item.module}</td>
                    <td className="py-2">{item.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>

        <section className="rounded-xl border border-neutral-700 bg-neutral-900/40 p-6">
          <h2 className="text-lg font-medium text-white">Detail Terbaru</h2>
          {loading && rows.length === 0 ? (
            <p className="mt-3 text-sm text-neutral-500">Memuat data...</p>
          ) : rows.length === 0 ? (
            <p className="mt-3 text-sm text-neutral-500">Belum ada entri.</p>
          ) : (
            <ul className="mt-3 space-y-3 text-sm text-neutral-300">
              {rows.slice(0, 10).map((row) => (
                <li key={row.id} className="rounded-md border border-neutral-700 bg-neutral-900/60 p-3">
                  <div className="flex items-center justify-between text-xs text-neutral-500">
                    <span>{row.module_name}</span>
                    <span>{new Date(row.created_at).toLocaleString('id-ID')}</span>
                  </div>
                  <pre className="mt-2 overflow-x-auto rounded bg-neutral-950/70 p-3 text-xs">
                    {JSON.stringify(row.submission_data, null, 2)}
                  </pre>
                </li>
              ))}
            </ul>
          )}
          {error && <p className="mt-3 text-sm text-red-400">{error}</p>}
        </section>
      </div>
    </div>
  )
}

