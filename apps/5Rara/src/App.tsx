import React, { useEffect, useMemo, useState } from 'react'
import { supabase } from './services/supabaseClient'
import { usePasskeySession } from '@shared/hooks/usePasskeySession'

const MODULE_NAME = '5Rara'

type TrackingRow = {
  id: string
  submission_data: {
    task?: string
    minutes?: number
    mood?: string
  }
  created_at: string
}

const defaultForm = {
  task: '',
  minutes: '',
  mood: 'senang',
}

export default function App() {
  const { status, session, error: authError, signIn, signOut } = usePasskeySession(supabase, { moduleId: 'm5_rara' })
  const [passkey, setPasskey] = useState('')
  const [entries, setEntries] = useState<TrackingRow[]>([])
  const [form, setForm] = useState(defaultForm)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    if (status === 'authenticated') {
      void loadEntries()
    }
  }, [status])

  async function loadEntries() {
    setLoading(true)
    setError(null)
    const { data, error } = await supabase
      .from('module_submissions')
      .select('id, submission_data, created_at')
      .eq('module_name', MODULE_NAME)
      .order('created_at', { ascending: false })
    if (error) setError(error.message)
    else setEntries(data ?? [])
    setLoading(false)
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    if (!session) return
    const minutes = Number(form.minutes)
    if (Number.isNaN(minutes) || minutes <= 0) {
      setError('Durasi harus angka positif (menit)')
      return
    }
    setLoading(true)
    setError(null)
    setMessage(null)
    const payload = {
      user_id: session.user.id,
      module_name: MODULE_NAME,
      submission_data: {
        task: form.task,
        minutes,
        mood: form.mood,
      },
    }
    const { error } = await supabase.from('module_submissions').insert(payload)
    if (error) {
      setError(error.message)
    } else {
      setMessage('Catatan waktu tersimpan')
      setForm(defaultForm)
      await loadEntries()
    }
    setLoading(false)
  }

  const totalMinutes = useMemo(() => entries.reduce((sum, entry) => sum + (entry.submission_data.minutes ?? 0), 0), [entries])

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
          <h1 className="text-xl font-semibold text-white">Masuk Modul RARA</h1>
          <p className="text-sm text-neutral-400">Passkey dibutuhkan untuk catatan waktu harian.</p>
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
              className="w-full rounded-md bg-sky-500 py-2 text-sm font-semibold text-white hover:bg-sky-400"
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
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-8">
        <header className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-semibold">RARA</h1>
            <p className="text-sm text-neutral-400">Rekap aktivitas dan mood harian.</p>
            <p className="text-sm text-neutral-500 mt-1">Total menit tercatat: {totalMinutes}</p>
          </div>
          <button
            onClick={() => signOut()}
            className="rounded-md border border-neutral-600 px-3 py-1 text-sm hover:bg-neutral-800"
          >
            Keluar
          </button>
        </header>

        <section className="rounded-xl border border-neutral-700 bg-neutral-900/60 p-6">
          <h2 className="text-lg font-medium text-white">Tambah Catatan Waktu</h2>
          <form onSubmit={handleSubmit} className="mt-4 grid gap-4">
            <label className="grid gap-1 text-sm">
              <span className="text-neutral-300">Aktivitas</span>
              <input
                className="rounded-md border border-neutral-600 bg-neutral-800 px-3 py-2"
                value={form.task}
                onChange={(event) => setForm((prev) => ({ ...prev, task: event.target.value }))}
              />
            </label>
            <label className="grid gap-1 text-sm">
              <span className="text-neutral-300">Durasi (menit)</span>
              <input
                className="rounded-md border border-neutral-600 bg-neutral-800 px-3 py-2"
                value={form.minutes}
                onChange={(event) => setForm((prev) => ({ ...prev, minutes: event.target.value }))}
              />
            </label>
            <label className="grid gap-1 text-sm">
              <span className="text-neutral-300">Mood</span>
              <select
                className="rounded-md border border-neutral-600 bg-neutral-800 px-3 py-2"
                value={form.mood}
                onChange={(event) => setForm((prev) => ({ ...prev, mood: event.target.value }))}
              >
                <option value="senang">Senang</option>
                <option value="netral">Netral</option>
                <option value="lelah">Lelah</option>
                <option value="stres">Stres</option>
              </select>
            </label>
            <div className="flex items-center gap-3">
              <button
                type="submit"
                className="rounded-md bg-sky-500 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-400 disabled:opacity-60"
                disabled={loading}
              >
                {loading ? 'Menyimpan...' : 'Simpan'}
              </button>
              {message && <span className="text-sm text-green-400">{message}</span>}
              {error && <span className="text-sm text-red-400">{error}</span>}
            </div>
          </form>
        </section>

        <section className="rounded-xl border border-neutral-700 bg-neutral-900/40 p-6">
          <h2 className="text-lg font-medium text-white">Riwayat Aktivitas</h2>
          {loading && entries.length === 0 ? (
            <p className="mt-3 text-sm text-neutral-500">Memuat data...</p>
          ) : entries.length === 0 ? (
            <p className="mt-3 text-sm text-neutral-500">Belum ada catatan.</p>
          ) : (
            <ul className="mt-3 space-y-3 text-sm text-neutral-300">
              {entries.map((entry) => (
                <li key={entry.id} className="rounded-md border border-neutral-700 bg-neutral-900/60 p-3">
                  <div className="flex items-center justify-between text-xs text-neutral-500">
                    <span>{new Date(entry.created_at).toLocaleString('id-ID')}</span>
                    <span>?? {entry.submission_data.minutes ?? 0} menit</span>
                  </div>
                  <p className="mt-1 text-sm font-medium text-neutral-100">{entry.submission_data.task || 'Tanpa judul'}</p>
                  <p className="text-xs text-neutral-400">Mood: {entry.submission_data.mood}</p>
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

