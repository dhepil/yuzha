import React, { useEffect, useState } from 'react'
import { supabase } from './services/supabaseClient'
import { usePasskeySession } from '@shared/hooks/usePasskeySession'

const MODULE_NAME = '4Extra'

interface ExtraItem {
  id: string
  submission_data: {
    title?: string
    description?: string
  }
  created_at: string
}

const defaultForm = {
  title: '',
  description: '',
}

export default function App() {
  const { status, session, error: authError, signIn, signOut } = usePasskeySession(supabase, { moduleId: 'm4_extra' })
  const [passkey, setPasskey] = useState('')
  const [items, setItems] = useState<ExtraItem[]>([])
  const [form, setForm] = useState(defaultForm)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    if (status === 'authenticated') {
      void loadItems()
    }
  }, [status])

  async function loadItems() {
    setLoading(true)
    setError(null)
    const { data, error } = await supabase
      .from('module_submissions')
      .select('id, submission_data, created_at')
      .eq('module_name', MODULE_NAME)
      .order('created_at', { ascending: false })
    if (error) setError(error.message)
    else setItems(data ?? [])
    setLoading(false)
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    if (!session) return
    if (!form.title.trim()) {
      setError('Judul tidak boleh kosong')
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
        description: form.description,
      },
    }
    const { error } = await supabase.from('module_submissions').insert(payload)
    if (error) {
      setError(error.message)
    } else {
      setMessage('Catatan tersimpan')
      setForm(defaultForm)
      await loadItems()
    }
    setLoading(false)
  }

  async function removeItem(id: string) {
    setLoading(true)
    setError(null)
    const { error } = await supabase.from('module_submissions').delete().eq('id', id)
    if (error) setError(error.message)
    else await loadItems()
    setLoading(false)
  }

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
          <h1 className="text-xl font-semibold text-white">Masuk Modul EXTRA</h1>
          <p className="text-sm text-neutral-400">Satu passkey untuk catatan ekstra pribadi.</p>
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
              className="w-full rounded-md bg-orange-500 py-2 text-sm font-semibold text-white hover:bg-orange-400"
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
            <h1 className="text-3xl font-semibold">EXTRA</h1>
            <p className="text-sm text-neutral-400">List catatan bebas: ide, tautan, reminder.</p>
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
              <span className="text-neutral-300">Deskripsi</span>
              <textarea
                rows={3}
                className="rounded-md border border-neutral-600 bg-neutral-800 px-3 py-2"
                value={form.description}
                onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
              />
            </label>
            <div className="flex items-center gap-3">
              <button
                type="submit"
                className="rounded-md bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-400 disabled:opacity-60"
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
          <h2 className="text-lg font-medium text-white">Daftar Catatan</h2>
          {loading && items.length === 0 ? (
            <p className="mt-3 text-sm text-neutral-500">Memuat data...</p>
          ) : items.length === 0 ? (
            <p className="mt-3 text-sm text-neutral-500">Belum ada catatan.</p>
          ) : (
            <ul className="mt-3 space-y-3 text-sm text-neutral-300">
              {items.map((item) => (
                <li key={item.id} className="rounded-md border border-neutral-700 bg-neutral-900/60 p-3">
                  <div className="flex items-center justify-between text-xs text-neutral-500">
                    <span>{new Date(item.created_at).toLocaleString('id-ID')}</span>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-xs text-red-300 hover:text-red-200"
                      disabled={loading}
                    >
                      Hapus
                    </button>
                  </div>
                  <h3 className="mt-1 text-sm font-semibold text-neutral-100">{item.submission_data.title}</h3>
                  {item.submission_data.description && (
                    <p className="mt-1 text-sm text-neutral-400">{item.submission_data.description}</p>
                  )}
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

