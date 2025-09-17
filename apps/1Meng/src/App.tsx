import React, { useEffect, useMemo, useState } from 'react'
import { supabase } from './services/supabaseClient'
import { usePasskeySession } from '@shared/hooks/usePasskeySession'

const MODULE_NAME = '1Meng'

type SubmissionRow = {
  id: string
  submission_data: {
    title?: string
    amount?: number
    note?: string
  }
  created_at: string
}

const initialForm = {
  title: '',
  amount: '',
  note: '',
}

export default function App() {
  const { status, session, error: authError, signIn, signOut } = usePasskeySession(supabase, { moduleId: 'm1_meng' })
  const [passkey, setPasskey] = useState('')
  const [form, setForm] = useState(initialForm)
  const [submissions, setSubmissions] = useState<SubmissionRow[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    if (status === 'authenticated') {
      void loadSubmissions()
    }
  }, [status])

  async function loadSubmissions() {
    setLoading(true)
    setError(null)
    const { data, error } = await supabase
      .from('module_submissions')
      .select('id, submission_data, created_at')
      .eq('module_name', MODULE_NAME)
      .order('created_at', { ascending: false })
    if (error) {
      setError(error.message)
    } else {
      setSubmissions(data ?? [])
    }
    setLoading(false)
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    if (!session) return
    const amountValue = Number(form.amount)
    if (Number.isNaN(amountValue) || amountValue <= 0) {
      setError('Nominal harus angka positif')
      return
    }
    setLoading(true)
    setError(null)
    setMessage(null)
    const payload = {
      user_id: session.user.id,
      module_name: MODULE_NAME,
      submission_data: {
        title: form.title,
        amount: amountValue,
        note: form.note,
      },
      submission_status: 'pending',
    }
    const { error } = await supabase.from('module_submissions').insert(payload)
    if (error) {
      setError(error.message)
    } else {
      setForm(initialForm)
      setMessage('Pengajuan berhasil disimpan')
      await loadSubmissions()
    }
    setLoading(false)
  }

  const totalSpent = useMemo(() => {
    return submissions.reduce((sum, row) => sum + (row.submission_data.amount ?? 0), 0)
  }, [submissions])

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
          <h1 className="text-xl font-semibold text-white">Masuk Modul 1MENG</h1>
          <p className="text-sm text-neutral-400">Gunakan passkey untuk mencatat pemasukan/pengeluaran.</p>
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
              className="w-full rounded-md bg-emerald-500 py-2 text-sm font-semibold text-white hover:bg-emerald-400"
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
            <h1 className="text-3xl font-semibold">1MENG</h1>
            <p className="text-sm text-neutral-400">Catat pemasukan harian dengan cepat.</p>
            <p className="text-sm text-neutral-500 mt-1">Total tercatat: Rp {totalSpent.toLocaleString('id-ID')}</p>
          </div>
          <button
            onClick={() => signOut()}
            className="rounded-md border border-neutral-600 px-3 py-1 text-sm hover:bg-neutral-800"
          >
            Keluar
          </button>
        </header>

        <section className="rounded-xl border border-neutral-700 bg-neutral-900/60 p-6">
          <h2 className="text-lg font-medium text-white">Tambah Catatan</h2>
          <form onSubmit={handleSubmit} className="mt-4 grid gap-4">
            <label className="grid gap-1 text-sm">
              <span className="text-neutral-300">Judul</span>
              <input
                className="rounded-md border border-neutral-600 bg-neutral-800 px-3 py-2"
                value={form.title}
                onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
              />
            </label>
            <label className="grid gap-1 text-sm">
              <span className="text-neutral-300">Nominal (Rp)</span>
              <input
                className="rounded-md border border-neutral-600 bg-neutral-800 px-3 py-2"
                value={form.amount}
                onChange={(event) => setForm((prev) => ({ ...prev, amount: event.target.value }))}
              />
            </label>
            <label className="grid gap-1 text-sm">
              <span className="text-neutral-300">Catatan</span>
              <textarea
                rows={3}
                className="rounded-md border border-neutral-600 bg-neutral-800 px-3 py-2"
                value={form.note}
                onChange={(event) => setForm((prev) => ({ ...prev, note: event.target.value }))}
              />
            </label>
            <div className="flex items-center gap-3">
              <button
                type="submit"
                className="rounded-md bg-emerald-500 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-400 disabled:opacity-60"
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
          <h2 className="text-lg font-medium text-white">Riwayat</h2>
          {loading && submissions.length === 0 ? (
            <p className="mt-3 text-sm text-neutral-500">Memuat data...</p>
          ) : submissions.length === 0 ? (
            <p className="mt-3 text-sm text-neutral-500">Belum ada catatan.</p>
          ) : (
            <ul className="mt-3 space-y-3 text-sm text-neutral-300">
              {submissions.map((item) => (
                <li key={item.id} className="rounded-md border border-neutral-700 bg-neutral-900/60 p-3">
                  <div className="flex items-center justify-between text-xs text-neutral-500">
                    <span>{item.submission_data.title || 'Tanpa Judul'}</span>
                    <span>{new Date(item.created_at).toLocaleString('id-ID')}</span>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-sm">
                    <span>Rp {(item.submission_data.amount ?? 0).toLocaleString('id-ID')}</span>
                    {item.submission_data.note && (
                      <span className="text-neutral-400">{item.submission_data.note}</span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  )
}


