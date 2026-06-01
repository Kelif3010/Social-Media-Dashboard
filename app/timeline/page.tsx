'use client'
import { useEffect, useState } from 'react'
import { supabase, VideoEntry } from '@/lib/supabase'
import { Plus, Trash2, ExternalLink, MapPin, Eye, Heart, MessageCircle, TrendingUp } from 'lucide-react'
import { format, parseISO } from 'date-fns'
import { de } from 'date-fns/locale'

const CATS = ['Vlog', 'Food', 'Reise', 'Challenge', 'Fitness', 'Sonstiges']
const catBadge: Record<string, string> = {
  Vlog: 'badge-teal', Food: 'badge-amber', Reise: 'badge-purple',
  Challenge: 'badge-red', Fitness: 'badge-blue', Sonstiges: 'badge-gray'
}
const catColor: Record<string, string> = {
  Vlog: '#4ecca3', Food: '#fbbf24', Reise: '#a78bfa',
  Challenge: '#f87171', Fitness: '#60a5fa', Sonstiges: '#888'
}

type FormatStats = { cat: string; count: number; avgViews: number; avgLikes: number; totalViews: number }

function fmt(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`
  return n.toLocaleString('de-DE')
}

export default function Timeline() {
  const [videos, setVideos] = useState<VideoEntry[]>([])
  const [adding, setAdding] = useState(false)
  const [filter, setFilter] = useState('Alle')
  const [tab, setTab]       = useState<'liste' | 'analyse'>('liste')
  const [form, setForm]     = useState({
    title: '', category: 'Vlog', upload_date: '', location: '',
    youtube_url: '', notes: '', views: '', likes: '', comments: ''
  })

  useEffect(() => { fetchVideos() }, [])

  async function fetchVideos() {
    const { data } = await supabase.from('video_timeline').select('*').order('upload_date', { ascending: false })
    if (data) setVideos(data)
  }

  async function addVideo() {
    if (!form.title.trim()) return
    await supabase.from('video_timeline').insert({
      title: form.title, category: form.category,
      upload_date: form.upload_date || null, location: form.location || null,
      youtube_url: form.youtube_url || null, notes: form.notes || null,
      views: form.views ? parseInt(form.views) : null,
      likes: form.likes ? parseInt(form.likes) : null,
      comments: form.comments ? parseInt(form.comments) : null,
    })
    setForm({ title: '', category: 'Vlog', upload_date: '', location: '', youtube_url: '', notes: '', views: '', likes: '', comments: '' })
    setAdding(false)
    fetchVideos()
  }

  async function deleteVideo(id: string) {
    await supabase.from('video_timeline').delete().eq('id', id)
    fetchVideos()
  }

  const filtered    = filter === 'Alle' ? videos : videos.filter(v => v.category === filter)
  const catCounts   = CATS.reduce((acc, c) => ({ ...acc, [c]: videos.filter(v => v.category === c).length }), {} as Record<string, number>)
  const totalViews  = videos.reduce((s, v) => s + (v.views || 0), 0)
  const totalLikes  = videos.reduce((s, v) => s + (v.likes || 0), 0)

  const formatStats: FormatStats[] = CATS.map(cat => {
    const catVids   = videos.filter(v => v.category === cat)
    const withViews = catVids.filter(v => v.views)
    return {
      cat, count: catVids.length,
      avgViews: withViews.length ? Math.round(withViews.reduce((s, v) => s + (v.views || 0), 0) / withViews.length) : 0,
      avgLikes: withViews.length ? Math.round(catVids.reduce((s, v) => s + (v.likes || 0), 0) / withViews.length) : 0,
      totalViews: catVids.reduce((s, v) => s + (v.views || 0), 0),
    }
  }).filter(s => s.count > 0).sort((a, b) => b.avgViews - a.avgViews)

  const maxAvgViews = Math.max(...formatStats.map(s => s.avgViews), 1)

  return (
    <main className="page">
      <div className="flex justify-between items-center mb-5">
        <div>
          <h1 className="text-xl font-semibold mb-0.5">Video-Timeline</h1>
          <p className="text-xs" style={{ color: '#666' }}>{videos.length} Videos</p>
        </div>
        <button className="btn btn-red text-sm" onClick={() => setAdding(!adding)}>
          <Plus size={15} /> Video
        </button>
      </div>

      {/* Stats — 2 cols on mobile, 3 on desktop */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-5">
        <div className="metric text-center">
          <div className="text-xl font-semibold">{videos.length}</div>
          <div className="text-xs mt-0.5" style={{ color: '#666' }}>Videos</div>
        </div>
        <div className="metric text-center">
          <div className="text-xl font-semibold">{fmt(totalViews)}</div>
          <div className="text-xs mt-0.5" style={{ color: '#666' }}>Views</div>
        </div>
        <div className="metric text-center col-span-2 md:col-span-1">
          <div className="text-xl font-semibold">{fmt(totalLikes)}</div>
          <div className="text-xs mt-0.5" style={{ color: '#666' }}>Likes</div>
        </div>
      </div>

      {/* Add form */}
      {adding && (
        <div className="card mb-5">
          <h3 className="text-sm font-medium mb-4">Video eintragen</h3>
          <div className="flex flex-col gap-3 mb-3">
            <div>
              <label className="text-xs mb-1 block" style={{ color: '#888' }}>Video-Titel</label>
              <input placeholder="z.B. Unser Wochenende in Neapel"
                value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs mb-1 block" style={{ color: '#888' }}>Kategorie</label>
                <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                  {CATS.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs mb-1 block" style={{ color: '#888' }}>Upload-Datum</label>
                <input type="date" value={form.upload_date}
                  onChange={e => setForm({ ...form, upload_date: e.target.value })} />
              </div>
            </div>
            <div>
              <label className="text-xs mb-1 block" style={{ color: '#888' }}>Aufnahmeort</label>
              <input placeholder="z.B. Stuttgart, Neapel" value={form.location}
                onChange={e => setForm({ ...form, location: e.target.value })} />
            </div>
            <div>
              <label className="text-xs mb-2 block font-medium" style={{ color: '#888' }}>Performance (optional)</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { key: 'views',    label: 'Views' },
                  { key: 'likes',    label: 'Likes' },
                  { key: 'comments', label: 'Kommentare' },
                ].map(({ key, label }) => (
                  <div key={key}>
                    <label className="text-xs mb-1 block" style={{ color: '#555' }}>{label}</label>
                    <input type="number" inputMode="numeric" placeholder="0"
                      value={(form as Record<string, string>)[key]}
                      onChange={e => setForm({ ...form, [key]: e.target.value })} />
                  </div>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs mb-1 block" style={{ color: '#888' }}>YouTube-Link</label>
              <input placeholder="https://youtu.be/…" value={form.youtube_url}
                onChange={e => setForm({ ...form, youtube_url: e.target.value })} />
            </div>
          </div>
          <div className="flex gap-2">
            <button className="btn btn-red" onClick={addVideo}>Eintragen</button>
            <button className="btn" onClick={() => setAdding(false)}>Abbrechen</button>
          </div>
        </div>
      )}

      {/* Tab switcher */}
      <div className="flex gap-2 mb-4 p-1 rounded-xl" style={{ background: '#141414' }}>
        {([
          { key: 'liste',   label: 'Liste' },
          { key: 'analyse', label: 'Bestes Format', icon: TrendingUp },
        ] as const).map(({ key, label, icon: Icon }) => (
          <button key={key}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-medium transition-all"
            style={{ background: tab === key ? '#1e1e1e' : 'transparent', color: tab === key ? 'white' : '#666' }}
            onClick={() => setTab(key)}>
            {Icon && <Icon size={14} />} {label}
          </button>
        ))}
      </div>

      {/* ANALYSE */}
      {tab === 'analyse' && (
        <div className="flex flex-col gap-3 mb-6">
          {formatStats.length === 0 ? (
            <div className="text-center py-10" style={{ color: '#555' }}>
              <TrendingUp size={28} className="mx-auto mb-3 opacity-30" />
              <p className="text-sm">Trage Views & Likes ein um die Analyse zu sehen.</p>
            </div>
          ) : formatStats.map((s, i) => (
            <div key={s.cat} className="card">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {i === 0 && <span>🏆</span>}
                  <span className={`badge ${catBadge[s.cat]}`}>{s.cat}</span>
                  <span className="text-xs" style={{ color: '#555' }}>{s.count} Videos</span>
                </div>
                {s.avgViews > 0 && (
                  <div className="text-sm font-semibold" style={{ color: catColor[s.cat] }}>
                    Ø {fmt(s.avgViews)} Views
                  </div>
                )}
              </div>
              {s.avgViews > 0 && (
                <div className="progress-bar-bg mb-2">
                  <div className="progress-bar-fill"
                    style={{ width: `${(s.avgViews / maxAvgViews) * 100}%`, background: catColor[s.cat] }} />
                </div>
              )}
              <div className="flex gap-4">
                <span className="flex items-center gap-1 text-xs" style={{ color: '#666' }}>
                  <Eye size={11} /> {fmt(s.totalViews)} gesamt
                </span>
                {s.avgLikes > 0 && (
                  <span className="flex items-center gap-1 text-xs" style={{ color: '#666' }}>
                    <Heart size={11} /> Ø {fmt(s.avgLikes)} Likes
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* LISTE */}
      {tab === 'liste' && (
        <>
          {/* Filter chips — scrollable on mobile */}
          <div className="flex gap-2 mb-4 overflow-x-auto pb-1 flex-wrap md:flex-nowrap" style={{ scrollbarWidth: 'none' }}>
            {['Alle', ...CATS].map(c => (
              <button key={c} className="btn text-xs py-1.5 px-3 flex-shrink-0"
                style={filter === c ? { background: '#1e1e1e', color: 'white', borderColor: '#333' } : {}}
                onClick={() => setFilter(c)}>
                {c}{c !== 'Alle' && catCounts[c] > 0 ? ` (${catCounts[c]})` : ''}
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-3 mb-6">
            {filtered.length === 0 ? (
              <div className="text-center py-10" style={{ color: '#555' }}>
                <p className="text-sm">Noch keine Videos — tragt euer erstes ein.</p>
              </div>
            ) : filtered.map(v => (
              <div key={v.id} className="card">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="text-sm font-medium">{v.title}</span>
                      <span className={`badge ${catBadge[v.category] || 'badge-gray'}`}>{v.category}</span>
                    </div>
                    <div className="flex items-center gap-3 flex-wrap">
                      {v.upload_date && (
                        <span className="text-xs" style={{ color: '#666' }}>
                          {format(parseISO(v.upload_date), 'd. MMM yy', { locale: de })}
                        </span>
                      )}
                      {v.location && (
                        <span className="flex items-center gap-1 text-xs" style={{ color: '#666' }}>
                          <MapPin size={10} /> {v.location}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    {v.youtube_url && (
                      <a href={v.youtube_url} target="_blank" rel="noopener noreferrer"
                        className="btn p-1.5" style={{ color: '#E63946', borderColor: 'transparent' }}>
                        <ExternalLink size={13} />
                      </a>
                    )}
                    <button className="btn p-1.5" style={{ color: '#555', borderColor: 'transparent' }}
                      onClick={() => deleteVideo(v.id)}>
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
                {(v.views || v.likes || v.comments) ? (
                  <div className="flex gap-4 pt-2 border-t" style={{ borderColor: '#1e1e1e' }}>
                    {v.views != null && (
                      <span className="flex items-center gap-1 text-xs" style={{ color: '#888' }}>
                        <Eye size={11} /> {fmt(v.views)}
                      </span>
                    )}
                    {v.likes != null && (
                      <span className="flex items-center gap-1 text-xs" style={{ color: '#888' }}>
                        <Heart size={11} /> {fmt(v.likes)}
                      </span>
                    )}
                    {v.comments != null && (
                      <span className="flex items-center gap-1 text-xs" style={{ color: '#888' }}>
                        <MessageCircle size={11} /> {fmt(v.comments)}
                      </span>
                    )}
                  </div>
                ) : null}
                {v.notes && <p className="text-xs mt-2" style={{ color: '#555' }}>{v.notes}</p>}
              </div>
            ))}
          </div>
        </>
      )}
    </main>
  )
}
