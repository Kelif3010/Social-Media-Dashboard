'use client'
import { useEffect, useState } from 'react'
import { supabase, PipelineVideo } from '@/lib/supabase'
import { Plus, Trash2, ArrowRight, ArrowLeft } from 'lucide-react'

const STATUSES = ['Idee', 'In Produktion', 'Im Schnitt', 'Fertig / Live']
const CATS = ['Vlog', 'Food', 'Reise', 'Challenge', 'Fitness', 'Sonstiges']
const catBadge: Record<string, string> = {
  Vlog: 'badge-teal', Food: 'badge-amber', Reise: 'badge-purple',
  Challenge: 'badge-red', Fitness: 'badge-blue', Sonstiges: 'badge-gray'
}
const statusColor = ['#a78bfa', '#fbbf24', '#60a5fa', '#4ecca3']

export default function Pipeline() {
  const [videos, setVideos] = useState<PipelineVideo[]>([])
  const [form, setForm]     = useState({ title: '', category: 'Vlog', notes: '' })
  const [adding, setAdding] = useState(false)

  useEffect(() => { fetchVideos() }, [])

  async function fetchVideos() {
    const { data } = await supabase.from('pipeline_videos').select('*').order('created_at', { ascending: false })
    if (data) setVideos(data)
  }

  async function addVideo() {
    if (!form.title.trim()) return
    await supabase.from('pipeline_videos').insert({ title: form.title, category: form.category, notes: form.notes, status: 0 })
    setForm({ title: '', category: 'Vlog', notes: '' })
    setAdding(false)
    fetchVideos()
  }

  async function moveVideo(id: string, dir: number, current: number) {
    const next = Math.max(0, Math.min(3, current + dir))
    await supabase.from('pipeline_videos').update({ status: next }).eq('id', id)
    fetchVideos()
  }

  async function deleteVideo(id: string) {
    await supabase.from('pipeline_videos').delete().eq('id', id)
    fetchVideos()
  }

  return (
    <main className="page-wide">
      <div className="flex justify-between items-center mb-5">
        <div>
          <h1 className="text-xl font-semibold mb-0.5">Video-Pipeline</h1>
          <p className="text-xs" style={{ color: '#666' }}>Von der Idee bis zum Upload</p>
        </div>
        <button className="btn btn-red text-sm" onClick={() => setAdding(!adding)}>
          <Plus size={15} /> Neue Idee
        </button>
      </div>

      {adding && (
        <div className="card mb-5">
          <h3 className="text-sm font-medium mb-4">Video hinzufügen</h3>
          <div className="flex flex-col gap-3 mb-3">
            <div>
              <label className="text-xs mb-1 block" style={{ color: '#888' }}>Titel / Thema</label>
              <input placeholder="z.B. Wir testen türkisches Frühstück" value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })} />
            </div>
            <div>
              <label className="text-xs mb-1 block" style={{ color: '#888' }}>Kategorie</label>
              <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                {CATS.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs mb-1 block" style={{ color: '#888' }}>Notizen (optional)</label>
              <textarea placeholder="Ideen, Locations, Besonderheiten…" value={form.notes}
                onChange={e => setForm({ ...form, notes: e.target.value })} rows={2} />
            </div>
          </div>
          <div className="flex gap-2">
            <button className="btn btn-red" onClick={addVideo}>Hinzufügen</button>
            <button className="btn" onClick={() => setAdding(false)}>Abbrechen</button>
          </div>
        </div>
      )}

      {/*
        Mobile: horizontal scroll (snap to column)
        Desktop: 4-column grid
        Handled via .kanban / .kanban-col in globals.css
      */}
      <div className="kanban">
        {STATUSES.map((status, idx) => {
          const col = videos.filter(v => v.status === idx)
          return (
            <div key={status} className="kanban-col">
              <div className="flex items-center justify-between mb-2 px-1">
                <div className="flex items-center gap-1.5">
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: statusColor[idx] }} />
                  <span className="text-xs font-medium uppercase tracking-wider" style={{ color: '#777' }}>
                    {status}
                  </span>
                </div>
                <span className="text-xs" style={{ color: '#444' }}>{col.length}</span>
              </div>
              <div className="flex flex-col gap-2">
                {col.map(v => (
                  <div key={v.id} className="card" style={{ padding: '12px 14px' }}>
                    <div className="text-sm font-medium mb-2">{v.title}</div>
                    <span className={`badge ${catBadge[v.category] || 'badge-gray'}`}>{v.category}</span>
                    {v.notes && <div className="text-xs mt-2" style={{ color: '#666' }}>{v.notes}</div>}
                    <div className="flex items-center gap-1 mt-3">
                      {v.status > 0 && (
                        <button className="btn text-xs py-1 px-2" onClick={() => moveVideo(v.id, -1, v.status)}>
                          <ArrowLeft size={11} />
                        </button>
                      )}
                      {v.status < 3 && (
                        <button className="btn text-xs py-1 px-2" onClick={() => moveVideo(v.id, 1, v.status)}>
                          <ArrowRight size={11} />
                        </button>
                      )}
                      <button className="btn text-xs py-1 px-2 ml-auto"
                        style={{ color: '#f87171', borderColor: '#2e0a0c' }}
                        onClick={() => deleteVideo(v.id)}>
                        <Trash2 size={11} />
                      </button>
                    </div>
                  </div>
                ))}
                {col.length === 0 && (
                  <div className="border border-dashed rounded-xl p-4 text-center text-xs"
                    style={{ borderColor: '#222', color: '#444' }}>Leer</div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </main>
  )
}
