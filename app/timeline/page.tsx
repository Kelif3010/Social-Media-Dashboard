'use client'
import { useEffect, useState } from 'react'
import { supabase, VideoEntry } from '@/lib/supabase'
import { Plus, Trash2, ExternalLink, MapPin, Clock } from 'lucide-react'
import { format, parseISO } from 'date-fns'
import { de } from 'date-fns/locale'
import Nav from '@/components/Nav'

const CATS = ['Vlog', 'Food', 'Reise', 'Challenge', 'Fitness', 'Sonstiges']
const catBadge: Record<string, string> = {
  Vlog: 'badge-teal', Food: 'badge-amber', Reise: 'badge-purple',
  Challenge: 'badge-red', Fitness: 'badge-blue', Sonstiges: 'badge-gray'
}

export default function Timeline() {
  const [videos, setVideos] = useState<VideoEntry[]>([])
  const [adding, setAdding] = useState(false)
  const [filter, setFilter] = useState('Alle')
  const [form, setForm] = useState({ title: '', category: 'Vlog', upload_date: '', location: '', youtube_url: '', notes: '' })

  useEffect(() => { fetchVideos() }, [])

  async function fetchVideos() {
    const { data } = await supabase.from('video_timeline').select('*').order('upload_date', { ascending: false })
    if (data) setVideos(data)
  }

  async function addVideo() {
    if (!form.title.trim()) return
    await supabase.from('video_timeline').insert({
      ...form,
      upload_date: form.upload_date || null,
      youtube_url: form.youtube_url || null,
      location: form.location || null,
      notes: form.notes || null,
    })
    setForm({ title: '', category: 'Vlog', upload_date: '', location: '', youtube_url: '', notes: '' })
    setAdding(false)
    fetchVideos()
  }

  async function deleteVideo(id: string) {
    await supabase.from('video_timeline').delete().eq('id', id)
    fetchVideos()
  }

  const filtered = filter === 'Alle' ? videos : videos.filter(v => v.category === filter)

  const catCounts = CATS.reduce((acc, c) => ({ ...acc, [c]: videos.filter(v => v.category === c).length }), {} as Record<string, number>)

  return (
    <div className="flex">
      <Nav />
      <main className="ml-56 flex-1 p-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-semibold mb-1">Video-Timeline</h1>
            <p className="text-sm" style={{ color: '#888' }}>{videos.length} Videos — alle Drehorte und Uploads</p>
          </div>
          <button className="btn btn-red" onClick={() => setAdding(!adding)}>
            <Plus size={15} /> Video eintragen
          </button>
        </div>

        <div className="grid grid-cols-4 gap-3 mb-6">
          <div className="metric">
            <div className="text-xs mb-1" style={{ color: '#666' }}>Gesamt</div>
            <div className="text-2xl font-semibold">{videos.length}</div>
          </div>
          {Object.entries(catCounts).filter(([, v]) => v > 0).slice(0, 3).map(([cat, count]) => (
            <div key={cat} className="metric">
              <div className="text-xs mb-1" style={{ color: '#666' }}>{cat}</div>
              <div className="text-2xl font-semibold">{count}</div>
            </div>
          ))}
        </div>

        {adding && (
          <div className="card mb-6">
            <h3 className="text-sm font-medium mb-4">Video eintragen</h3>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label className="text-xs mb-1 block" style={{ color: '#888' }}>Video-Titel</label>
                <input placeholder="z.B. Unser Wochenende in Neapel" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
              </div>
              <div>
                <label className="text-xs mb-1 block" style={{ color: '#888' }}>Kategorie</label>
                <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                  {CATS.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 mb-3">
              <div>
                <label className="text-xs mb-1 block" style={{ color: '#888' }}>Upload-Datum</label>
                <input type="date" value={form.upload_date} onChange={e => setForm({ ...form, upload_date: e.target.value })} />
              </div>
              <div>
                <label className="text-xs mb-1 block" style={{ color: '#888' }}>Aufnahmeort</label>
                <input placeholder="z.B. Stuttgart, Neapel" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} />
              </div>
              <div>
                <label className="text-xs mb-1 block" style={{ color: '#888' }}>YouTube-Link (optional)</label>
                <input placeholder="https://youtu.be/..." value={form.youtube_url} onChange={e => setForm({ ...form, youtube_url: e.target.value })} />
              </div>
            </div>
            <div className="mb-3">
              <label className="text-xs mb-1 block" style={{ color: '#888' }}>Notizen</label>
              <input placeholder="z.B. beste Views, besonderer Moment" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} />
            </div>
            <div className="flex gap-2">
              <button className="btn btn-red" onClick={addVideo}>Eintragen</button>
              <button className="btn" onClick={() => setAdding(false)}>Abbrechen</button>
            </div>
          </div>
        )}

        <div className="flex gap-2 mb-4 flex-wrap">
          {['Alle', ...CATS].map(c => (
            <button key={c} className="btn text-xs py-1.5 px-3"
              style={filter === c ? { background: '#1e1e1e', color: 'white' } : {}}
              onClick={() => setFilter(c)}>
              {c} {c !== 'Alle' && catCounts[c] > 0 ? `(${catCounts[c]})` : ''}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-3">
          {filtered.length === 0 ? (
            <div className="text-center py-12" style={{ color: '#555' }}>
              <Clock size={32} className="mx-auto mb-3 opacity-30" />
              <p className="text-sm">Noch keine Videos — tragt euer erstes ein.</p>
            </div>
          ) : filtered.map(v => (
            <div key={v.id} className="card flex items-start gap-4">
              <div className="flex-shrink-0 text-center" style={{ minWidth: 60 }}>
                {v.upload_date ? (
                  <>
                    <div className="text-lg font-semibold">{format(parseISO(v.upload_date), 'd')}</div>
                    <div className="text-xs" style={{ color: '#666' }}>{format(parseISO(v.upload_date), 'MMM yy', { locale: de })}</div>
                  </>
                ) : <div className="text-xs" style={{ color: '#444' }}>kein Datum</div>}
              </div>
              <div className="w-px self-stretch" style={{ background: '#222' }} />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium">{v.title}</span>
                  <span className={`badge ${catBadge[v.category] || 'badge-gray'}`}>{v.category}</span>
                </div>
                <div className="flex items-center gap-3 mt-1">
                  {v.location && (
                    <span className="flex items-center gap-1 text-xs" style={{ color: '#666' }}>
                      <MapPin size={11} /> {v.location}
                    </span>
                  )}
                  {v.notes && <span className="text-xs" style={{ color: '#555' }}>{v.notes}</span>}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {v.youtube_url && (
                  <a href={v.youtube_url} target="_blank" rel="noopener noreferrer" className="btn p-1.5" style={{ color: '#E63946', borderColor: 'transparent' }}>
                    <ExternalLink size={13} />
                  </a>
                )}
                <button className="btn p-1.5" style={{ color: '#555', borderColor: 'transparent' }} onClick={() => deleteVideo(v.id)}>
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
