'use client'
import { useEffect, useState } from 'react'
import { Youtube, Eye, ThumbsUp, MessageCircle, TrendingUp, Hash, RefreshCw, ExternalLink, Award, BarChart2 } from 'lucide-react'
import { format, parseISO } from 'date-fns'
import { de } from 'date-fns/locale'

type ChannelStats = {
  title: string
  subscribers: number
  totalViews: number
  videoCount: number
  thumbnail: string
}

type Video = {
  id: string
  title: string
  publishedAt: string
  thumbnail: string
  tags: string[]
  views: number
  likes: number
  comments: number
  url: string
  duration?: string
}

function parseDuration(iso: string): string {
  if (!iso) return ''
  const m = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/)
  if (!m) return ''
  const h = parseInt(m[1] || '0')
  const min = parseInt(m[2] || '0')
  const s = parseInt(m[3] || '0')
  if (h > 0) return `${h}:${String(min).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  return `${min}:${String(s).padStart(2, '0')}`
}

function engagementRate(v: Video): string {
  if (!v.views) return '0%'
  return ((v.likes + v.comments) / v.views * 100).toFixed(1) + '%'
}

function fmt(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`
  return n.toLocaleString('de-DE')
}

export default function Analytics() {
  const [stats, setStats] = useState<ChannelStats | null>(null)
  const [videos, setVideos] = useState<Video[]>([])
  const [topVideos, setTopVideos] = useState<Video[]>([])
  const [tab, setTab] = useState<'overview' | 'videos' | 'top' | 'hashtags'>('overview')
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => { fetchAll() }, [])

  async function fetchAll() {
    setLoading(true)
    setError('')
    try {
      const [ovRes, vidRes, topRes] = await Promise.all([
        fetch('/api/youtube?type=overview'),
        fetch('/api/youtube?type=videos&max=20'),
        fetch('/api/youtube?type=topsongs'),
      ])
      const [ov, vid, top] = await Promise.all([ovRes.json(), vidRes.json(), topRes.json()])
      if (ov.error) { setError(ov.error); setLoading(false); return }
      setStats(ov)
      setVideos(vid.videos || [])
      setTopVideos(top.videos || [])
    } catch {
      setError('Verbindungsfehler — prüfe den YouTube API Key.')
    }
    setLoading(false)
  }

  async function refresh() {
    setRefreshing(true)
    await fetchAll()
    setRefreshing(false)
  }

  const allTags = videos.flatMap(v => v.tags)
  const tagCounts = allTags.reduce((acc, t) => ({ ...acc, [t]: (acc[t] || 0) + 1 }), {} as Record<string, number>)
  const topTags = Object.entries(tagCounts).sort((a, b) => b[1] - a[1]).slice(0, 30)
  const avgViews = videos.length ? Math.round(videos.reduce((s, v) => s + v.views, 0) / videos.length) : 0
  const avgLikes = videos.length ? Math.round(videos.reduce((s, v) => s + v.likes, 0) / videos.length) : 0
  const bestVideo = [...videos].sort((a, b) => b.views - a.views)[0]

  if (loading) return (
    <main className="page flex items-center justify-center min-h-screen">
      <div className="text-center">
        <Youtube size={32} className="mx-auto mb-3 opacity-30" />
        <div className="text-sm" style={{ color: '#555' }}>YouTube Daten werden geladen…</div>
      </div>
    </main>
  )

  if (error) return (
    <main className="page flex items-center justify-center min-h-screen">
      <div className="card text-center w-full max-w-sm">
        <div className="text-2xl mb-3">⚠️</div>
        <div className="text-sm font-medium mb-2">Verbindungsfehler</div>
        <div className="text-xs mb-4" style={{ color: '#888' }}>{error}</div>
        <p className="text-xs mb-4" style={{ color: '#555' }}>
          Stelle sicher dass <code style={{ color: '#E63946' }}>YOUTUBE_API_KEY</code> in Vercel eingetragen ist.
        </p>
        <button className="btn btn-red w-full justify-center" onClick={fetchAll}>Nochmal versuchen</button>
      </div>
    </main>
  )

  return (
    <main className="page-wide">
      {/* Header */}
      <div className="flex justify-between items-center mb-5">
        <div className="flex items-center gap-3">
          {stats?.thumbnail && (
            <img src={stats.thumbnail} alt="Kanal"
              className="w-10 h-10 rounded-full object-cover flex-shrink-0"
              style={{ border: '2px solid #E63946' }} />
          )}
          <div>
            <h1 className="text-xl font-semibold mb-0.5">YouTube Analytics</h1>
            <p className="text-xs" style={{ color: '#666' }}>{stats?.title}</p>
          </div>
        </div>
        <button className="btn text-sm" onClick={refresh} disabled={refreshing}>
          <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
          <span className="hidden sm:inline">Aktualisieren</span>
        </button>
      </div>

      {/* Stats — 2 cols on mobile, 4 on desktop */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        {[
          { label: 'Abonnenten',    value: fmt(stats?.subscribers || 0),  icon: Youtube },
          { label: 'Views gesamt',  value: fmt(stats?.totalViews || 0),   icon: Eye },
          { label: 'Videos',        value: String(stats?.videoCount || 0), icon: BarChart2 },
          { label: 'Ø Views/Video', value: fmt(avgViews),                  icon: TrendingUp },
        ].map(({ label, value, icon: Icon }) => (
          <div key={label} className="metric">
            <div className="flex items-center gap-1.5 mb-1">
              <Icon size={12} style={{ color: '#555' }} />
              <div className="text-xs" style={{ color: '#888' }}>{label}</div>
            </div>
            <div className="text-xl font-semibold">{value}</div>
          </div>
        ))}
      </div>

      {/* Tabs — scrollable on mobile */}
      <div className="flex gap-2 mb-5 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
        {[
          { key: 'overview',  icon: BarChart2,  label: 'Übersicht'     },
          { key: 'videos',    icon: Youtube,    label: 'Alle Videos'   },
          { key: 'top',       icon: Award,      label: 'Top Videos'    },
          { key: 'hashtags',  icon: Hash,       label: 'Tags'          },
        ].map(({ key, icon: Icon, label }) => (
          <button key={key} className="btn text-xs py-1.5 px-3 flex-shrink-0"
            style={tab === key ? { background: '#1e1e1e', color: 'white', borderColor: '#333' } : {}}
            onClick={() => setTab(key as typeof tab)}>
            <Icon size={13} /> {label}
          </button>
        ))}
      </div>

      {/* ── OVERVIEW TAB ──────────────────────────────── */}
      {tab === 'overview' && (
        <div className="flex flex-col md:grid md:grid-cols-2 gap-4 mb-6">
          {/* Best video */}
          <div className="card">
            <div className="text-xs font-medium mb-4 uppercase tracking-wider" style={{ color: '#666' }}>Bestes Video</div>
            {bestVideo ? (
              <div>
                <img src={bestVideo.thumbnail} alt={bestVideo.title}
                  className="w-full rounded-xl mb-3 object-cover" style={{ aspectRatio: '16/9' }} />
                <div className="text-sm font-medium mb-3">{bestVideo.title}</div>
                <div className="grid grid-cols-3 gap-2 mb-3">
                  {[
                    { label: 'Views', value: fmt(bestVideo.views) },
                    { label: 'Likes', value: fmt(bestVideo.likes) },
                    { label: 'Engagement', value: engagementRate(bestVideo) },
                  ].map(({ label, value }) => (
                    <div key={label} className="metric text-center" style={{ padding: 10 }}>
                      <div className="text-xs mb-1" style={{ color: '#666' }}>{label}</div>
                      <div className="text-sm font-semibold">{value}</div>
                    </div>
                  ))}
                </div>
                <a href={bestVideo.url} target="_blank" rel="noopener noreferrer"
                  className="btn text-xs w-full justify-center">
                  <ExternalLink size={12} /> Auf YouTube öffnen
                </a>
              </div>
            ) : <p className="text-xs" style={{ color: '#555' }}>Keine Videos gefunden.</p>}
          </div>

          {/* Right column */}
          <div className="flex flex-col gap-4">
            <div className="card">
              <div className="text-xs font-medium mb-3 uppercase tracking-wider" style={{ color: '#666' }}>Kanal-Durchschnitt</div>
              {[
                { label: 'Ø Views pro Video', value: fmt(avgViews),  icon: Eye },
                { label: 'Ø Likes pro Video', value: fmt(avgLikes),  icon: ThumbsUp },
                { label: 'Top-Tag',           value: topTags[0]?.[0] || '—', icon: Hash },
              ].map(({ label, value, icon: Icon }) => (
                <div key={label} className="flex items-center justify-between py-2.5 border-b" style={{ borderColor: '#1e1e1e' }}>
                  <div className="flex items-center gap-2 text-sm" style={{ color: '#888' }}>
                    <Icon size={13} /> {label}
                  </div>
                  <span className="text-sm font-medium">{value}</span>
                </div>
              ))}
            </div>

            <div className="card">
              <div className="text-xs font-medium mb-3 uppercase tracking-wider" style={{ color: '#666' }}>Top 5 Tags</div>
              <div className="flex flex-wrap gap-2">
                {topTags.slice(0, 5).map(([tag, count]) => (
                  <div key={tag} className="badge badge-purple flex items-center gap-1">
                    <Hash size={10} /> {tag}
                    <span style={{ opacity: 0.6 }}>({count})</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="card">
              <div className="text-xs font-medium mb-3 uppercase tracking-wider" style={{ color: '#666' }}>Letzte 5 Videos</div>
              {videos.slice(0, 5).map(v => (
                <div key={v.id} className="flex items-center justify-between py-2.5 border-b" style={{ borderColor: '#1e1e1e' }}>
                  <div className="text-xs truncate flex-1 mr-2">{v.title}</div>
                  <div className="flex items-center gap-1 text-xs flex-shrink-0" style={{ color: '#666' }}>
                    <Eye size={11} /> {fmt(v.views)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── VIDEOS TAB ────────────────────────────────── */}
      {tab === 'videos' && (
        <div className="flex flex-col gap-3 mb-6">
          {videos.map(v => (
            <div key={v.id} className="card flex flex-col md:flex-row gap-3 items-start">
              <img src={v.thumbnail} alt={v.title}
                className="w-full md:w-36 md:flex-shrink-0 rounded-xl object-cover"
                style={{ aspectRatio: '16/9', height: undefined }} />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium mb-1">{v.title}</div>
                <div className="text-xs mb-2" style={{ color: '#555' }}>
                  {format(parseISO(v.publishedAt), 'd. MMMM yyyy', { locale: de })}
                  {v.duration && <span className="ml-2">{parseDuration(v.duration)}</span>}
                </div>
                <div className="flex flex-wrap gap-3">
                  <span className="flex items-center gap-1 text-xs" style={{ color: '#888' }}>
                    <Eye size={12} /> {fmt(v.views)}
                  </span>
                  <span className="flex items-center gap-1 text-xs" style={{ color: '#888' }}>
                    <ThumbsUp size={12} /> {fmt(v.likes)}
                  </span>
                  <span className="flex items-center gap-1 text-xs" style={{ color: '#888' }}>
                    <MessageCircle size={12} /> {fmt(v.comments)}
                  </span>
                  <span className="flex items-center gap-1 text-xs" style={{ color: '#4ecca3' }}>
                    <TrendingUp size={12} /> {engagementRate(v)}
                  </span>
                </div>
                {v.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {v.tags.slice(0, 5).map(t => (
                      <span key={t} className="badge badge-gray">{t}</span>
                    ))}
                  </div>
                )}
              </div>
              <a href={v.url} target="_blank" rel="noopener noreferrer"
                className="btn p-2 flex-shrink-0" style={{ color: '#E63946', borderColor: 'transparent' }}>
                <ExternalLink size={14} />
              </a>
            </div>
          ))}
        </div>
      )}

      {/* ── TOP VIDEOS TAB ────────────────────────────── */}
      {tab === 'top' && (
        <div className="flex flex-col gap-3 mb-6">
          <div className="text-xs mb-1" style={{ color: '#555' }}>Sortiert nach Views — deine erfolgreichsten Videos</div>
          {topVideos.map((v, i) => (
            <div key={v.id} className="card flex gap-3 items-center">
              <div className="text-xl font-semibold flex-shrink-0 w-7 text-center"
                style={{ color: i === 0 ? '#E63946' : i === 1 ? '#fbbf24' : i === 2 ? '#a78bfa' : '#444' }}>
                {i + 1}
              </div>
              <img src={v.thumbnail} alt={v.title}
                className="rounded-lg object-cover flex-shrink-0"
                style={{ width: 100, height: 56, minWidth: 100 }} />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium mb-1 line-clamp-2">{v.title}</div>
                <div className="flex flex-wrap gap-3">
                  <span className="flex items-center gap-1 text-xs font-semibold" style={{ color: 'white' }}>
                    <Eye size={11} style={{ color: '#E63946' }} /> {fmt(v.views)}
                  </span>
                  <span className="flex items-center gap-1 text-xs" style={{ color: '#888' }}>
                    <ThumbsUp size={11} /> {fmt(v.likes)}
                  </span>
                  <span className="flex items-center gap-1 text-xs" style={{ color: '#4ecca3' }}>
                    <TrendingUp size={11} /> {engagementRate(v)}
                  </span>
                </div>
              </div>
              <a href={v.url} target="_blank" rel="noopener noreferrer"
                className="btn p-2 flex-shrink-0" style={{ color: '#E63946', borderColor: 'transparent' }}>
                <ExternalLink size={13} />
              </a>
            </div>
          ))}
        </div>
      )}

      {/* ── HASHTAGS TAB ──────────────────────────────── */}
      {tab === 'hashtags' && (
        <div className="flex flex-col md:grid md:grid-cols-2 gap-4 mb-6">
          <div className="card">
            <div className="text-xs font-medium mb-4 uppercase tracking-wider" style={{ color: '#666' }}>Top Tags nach Häufigkeit</div>
            <div className="flex flex-col gap-2">
              {topTags.map(([tag, count], i) => {
                const max = topTags[0]?.[1] || 1
                const pct = Math.round((count / max) * 100)
                return (
                  <div key={tag}>
                    <div className="flex justify-between text-xs mb-1">
                      <span>{tag}</span>
                      <span style={{ color: '#666' }}>{count}×</span>
                    </div>
                    <div className="progress-bar-bg">
                      <div className="progress-bar-fill" style={{ width: `${pct}%`, background: i < 3 ? '#E63946' : '#333' }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="card">
            <div className="text-xs font-medium mb-4 uppercase tracking-wider" style={{ color: '#666' }}>Tag-Cloud</div>
            <div className="flex flex-wrap gap-2">
              {topTags.map(([tag, count]) => {
                const max = topTags[0]?.[1] || 1
                const size = 10 + Math.round((count / max) * 8)
                return (
                  <span key={tag} className="badge badge-purple" style={{ fontSize: size }}>#{tag}</span>
                )
              })}
            </div>
            <div className="mt-5 pt-4 border-t" style={{ borderColor: '#1e1e1e' }}>
              <div className="text-xs font-medium mb-2 uppercase tracking-wider" style={{ color: '#666' }}>Empfehlung</div>
              <p className="text-xs leading-relaxed" style={{ color: '#666' }}>
                Die Tags <span style={{ color: 'white' }}>{topTags.slice(0, 3).map(([t]) => `#${t}`).join(', ')}</span> performen
                am häufigsten. Nutzt diese konsistent in neuen Uploads für bessere Auffindbarkeit.
              </p>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
