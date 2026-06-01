'use client'
import { useEffect, useState } from 'react'
import { Youtube, Eye, ThumbsUp, MessageCircle, TrendingUp, Hash, RefreshCw, ExternalLink, Award, BarChart2 } from 'lucide-react'
import { format, parseISO } from 'date-fns'
import { de } from 'date-fns/locale'
import Nav from '@/components/Nav'

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
  if (h > 0) return `${h}:${String(min).padStart(2,'0')}:${String(s).padStart(2,'0')}`
  return `${min}:${String(s).padStart(2,'0')}`
}

function engagementRate(v: Video): string {
  if (!v.views) return '0%'
  return ((v.likes + v.comments) / v.views * 100).toFixed(1) + '%'
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
      setError('Verbindungsfehler — prüfe den YouTube API Key in Vercel.')
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
    <div className="flex">
      <Nav />
      <main className="ml-56 flex-1 p-8 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Youtube size={32} className="mx-auto mb-3 opacity-30" />
          <div className="text-sm" style={{ color: '#555' }}>YouTube Daten werden geladen...</div>
        </div>
      </main>
    </div>
  )

  if (error) return (
    <div className="flex">
      <Nav />
      <main className="ml-56 flex-1 p-8 flex items-center justify-center min-h-screen">
        <div className="card text-center max-w-sm">
          <div className="text-2xl mb-3">⚠️</div>
          <div className="text-sm font-medium mb-2">Verbindungsfehler</div>
          <div className="text-xs mb-4" style={{ color: '#888' }}>{error}</div>
          <p className="text-xs mb-4" style={{ color: '#555' }}>
            Stelle sicher dass <code style={{ color: '#E63946' }}>YOUTUBE_API_KEY</code> in Vercel eingetragen und das Projekt redeployt wurde.
          </p>
          <button className="btn btn-red" onClick={fetchAll}>Nochmal versuchen</button>
        </div>
      </main>
    </div>
  )

  return (
    <div className="flex">
      <Nav />
      <main className="ml-56 flex-1 p-8">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            {stats?.thumbnail && (
              <img src={stats.thumbnail} alt="Kanal" className="w-10 h-10 rounded-full object-cover" style={{ border: '2px solid #E63946' }} />
            )}
            <div>
              <h1 className="text-2xl font-semibold mb-0.5">YouTube Analytics</h1>
              <p className="text-sm" style={{ color: '#888' }}>{stats?.title}</p>
            </div>
          </div>
          <button className="btn" onClick={refresh} disabled={refreshing}>
            <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
            Aktualisieren
          </button>
        </div>

        <div className="grid grid-cols-4 gap-3 mb-6">
          <div className="metric">
            <div className="text-xs mb-1" style={{ color: '#888' }}>Abonnenten</div>
            <div className="text-2xl font-semibold">{stats?.subscribers.toLocaleString('de-DE')}</div>
          </div>
          <div className="metric">
            <div className="text-xs mb-1" style={{ color: '#888' }}>Views gesamt</div>
            <div className="text-2xl font-semibold">{stats?.totalViews.toLocaleString('de-DE')}</div>
          </div>
          <div className="metric">
            <div className="text-xs mb-1" style={{ color: '#888' }}>Videos</div>
            <div className="text-2xl font-semibold">{stats?.videoCount}</div>
          </div>
          <div className="metric">
            <div className="text-xs mb-1" style={{ color: '#888' }}>Ø Views / Video</div>
            <div className="text-2xl font-semibold">{avgViews.toLocaleString('de-DE')}</div>
          </div>
        </div>

        <div className="flex gap-2 mb-6">
          {[
            { key: 'overview', icon: BarChart2, label: 'Übersicht' },
            { key: 'videos', icon: Youtube, label: 'Alle Videos' },
            { key: 'top', icon: Award, label: 'Top Videos' },
            { key: 'hashtags', icon: Hash, label: 'Hashtags & Tags' },
          ].map(({ key, icon: Icon, label }) => (
            <button key={key} className="btn text-xs py-1.5 px-3"
              style={tab === key ? { background: '#1e1e1e', color: 'white' } : {}}
              onClick={() => setTab(key as any)}>
              <Icon size={13} /> {label}
            </button>
          ))}
        </div>

        {tab === 'overview' && (
          <div className="grid grid-cols-2 gap-4">
            <div className="card">
              <div className="text-sm font-medium mb-4" style={{ color: '#888' }}>BESTES VIDEO</div>
              {bestVideo ? (
                <div>
                  <img src={bestVideo.thumbnail} alt={bestVideo.title} className="w-full rounded-lg mb-3 object-cover" style={{ height: 140 }} />
                  <div className="text-sm font-medium mb-2">{bestVideo.title}</div>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="metric" style={{ padding: '10px' }}>
                      <div className="text-xs mb-1" style={{ color: '#666' }}>Views</div>
                      <div className="text-base font-semibold">{bestVideo.views.toLocaleString('de-DE')}</div>
                    </div>
                    <div className="metric" style={{ padding: '10px' }}>
                      <div className="text-xs mb-1" style={{ color: '#666' }}>Likes</div>
                      <div className="text-base font-semibold">{bestVideo.likes.toLocaleString('de-DE')}</div>
                    </div>
                    <div className="metric" style={{ padding: '10px' }}>
                      <div className="text-xs mb-1" style={{ color: '#666' }}>Engagement</div>
                      <div className="text-base font-semibold">{engagementRate(bestVideo)}</div>
                    </div>
                  </div>
                  <a href={bestVideo.url} target="_blank" rel="noopener noreferrer"
                    className="btn text-xs mt-3 w-full justify-center">
                    <ExternalLink size={12} /> Auf YouTube öffnen
                  </a>
                </div>
              ) : <p className="text-xs" style={{ color: '#555' }}>Keine Videos gefunden.</p>}
            </div>

            <div className="flex flex-col gap-4">
              <div className="card">
                <div className="text-sm font-medium mb-4" style={{ color: '#888' }}>KANAL-DURCHSCHNITT</div>
                <div className="flex flex-col gap-3">
                  {[
                    { label: 'Ø Views pro Video', value: avgViews.toLocaleString('de-DE'), icon: Eye },
                    { label: 'Ø Likes pro Video', value: avgLikes.toLocaleString('de-DE'), icon: ThumbsUp },
                    { label: 'Top-Tag', value: topTags[0]?.[0] || '—', icon: Hash },
                  ].map(({ label, value, icon: Icon }) => (
                    <div key={label} className="flex items-center justify-between py-2 border-b" style={{ borderColor: '#1e1e1e' }}>
                      <div className="flex items-center gap-2 text-sm" style={{ color: '#888' }}>
                        <Icon size={14} /> {label}
                      </div>
                      <span className="text-sm font-medium">{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card">
                <div className="text-sm font-medium mb-4" style={{ color: '#888' }}>TOP 5 TAGS</div>
                <div className="flex flex-wrap gap-2">
                  {topTags.slice(0, 5).map(([tag, count]) => (
                    <div key={tag} className="flex items-center gap-1.5 badge badge-purple">
                      <Hash size={10} /> {tag}
                      <span style={{ opacity: 0.6 }}>({count})</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card">
                <div className="text-sm font-medium mb-3" style={{ color: '#888' }}>LETZTE 5 VIDEOS</div>
                {videos.slice(0, 5).map(v => (
                  <div key={v.id} className="flex items-center justify-between py-2 border-b" style={{ borderColor: '#1e1e1e' }}>
                    <div className="text-xs truncate flex-1 mr-2">{v.title}</div>
                    <div className="flex items-center gap-1 text-xs flex-shrink-0" style={{ color: '#666' }}>
                      <Eye size={11} /> {v.views.toLocaleString('de-DE')}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === 'videos' && (
          <div className="flex flex-col gap-3">
            {videos.map(v => (
              <div key={v.id} className="card flex gap-4 items-start">
                <img src={v.thumbnail} alt={v.title} className="rounded-lg object-cover flex-shrink-0"
                  style={{ width: 140, height: 80 }} />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium mb-1 truncate">{v.title}</div>
                  <div className="text-xs mb-2" style={{ color: '#555' }}>
                    {format(parseISO(v.publishedAt), 'd. MMMM yyyy', { locale: de })}
                    {v.duration && <span className="ml-2">{parseDuration(v.duration)}</span>}
                  </div>
                  <div className="flex gap-4">
                    <span className="flex items-center gap-1 text-xs" style={{ color: '#888' }}>
                      <Eye size={12} /> {v.views.toLocaleString('de-DE')}
                    </span>
                    <span className="flex items-center gap-1 text-xs" style={{ color: '#888' }}>
                      <ThumbsUp size={12} /> {v.likes.toLocaleString('de-DE')}
                    </span>
                    <span className="flex items-center gap-1 text-xs" style={{ color: '#888' }}>
                      <MessageCircle size={12} /> {v.comments.toLocaleString('de-DE')}
                    </span>
                    <span className="flex items-center gap-1 text-xs" style={{ color: '#4ecca3' }}>
                      <TrendingUp size={12} /> {engagementRate(v)}
                    </span>
                  </div>
                  {v.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {v.tags.slice(0, 5).map(t => (
                        <span key={t} className="badge badge-gray text-xs">{t}</span>
                      ))}
                    </div>
                  )}
                </div>
                <a href={v.url} target="_blank" rel="noopener noreferrer"
                  className="btn p-1.5 flex-shrink-0" style={{ color: '#E63946', borderColor: 'transparent' }}>
                  <ExternalLink size={14} />
                </a>
              </div>
            ))}
          </div>
        )}

        {tab === 'top' && (
          <div className="flex flex-col gap-3">
            <div className="text-xs mb-2" style={{ color: '#555' }}>Sortiert nach Views — deine erfolgreichsten Videos aller Zeiten</div>
            {topVideos.map((v, i) => (
              <div key={v.id} className="card flex gap-4 items-center">
                <div className="text-2xl font-semibold flex-shrink-0 w-8 text-center"
                  style={{ color: i === 0 ? '#E63946' : i === 1 ? '#fbbf24' : i === 2 ? '#a78bfa' : '#444' }}>
                  {i + 1}
                </div>
                <img src={v.thumbnail} alt={v.title} className="rounded-lg object-cover flex-shrink-0"
                  style={{ width: 120, height: 68 }} />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium mb-1 truncate">{v.title}</div>
                  <div className="flex gap-4">
                    <span className="flex items-center gap-1 text-xs font-semibold" style={{ color: 'white' }}>
                      <Eye size={12} style={{ color: '#E63946' }} /> {v.views.toLocaleString('de-DE')} Views
                    </span>
                    <span className="flex items-center gap-1 text-xs" style={{ color: '#888' }}>
                      <ThumbsUp size={12} /> {v.likes.toLocaleString('de-DE')}
                    </span>
                    <span className="flex items-center gap-1 text-xs" style={{ color: '#4ecca3' }}>
                      <TrendingUp size={12} /> {engagementRate(v)}
                    </span>
                  </div>
                  {v.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {v.tags.slice(0, 4).map(t => (
                        <span key={t} className="badge badge-gray">{t}</span>
                      ))}
                    </div>
                  )}
                </div>
                <a href={v.url} target="_blank" rel="noopener noreferrer"
                  className="btn p-1.5 flex-shrink-0" style={{ color: '#E63946', borderColor: 'transparent' }}>
                  <ExternalLink size={14} />
                </a>
              </div>
            ))}
          </div>
        )}

        {tab === 'hashtags' && (
          <div className="grid grid-cols-2 gap-4">
            <div className="card">
              <div className="text-sm font-medium mb-4" style={{ color: '#888' }}>TOP TAGS NACH HÄUFIGKEIT</div>
              <div className="flex flex-col gap-2">
                {topTags.map(([tag, count], i) => {
                  const max = topTags[0]?.[1] || 1
                  const pct = Math.round((count / max) * 100)
                  return (
                    <div key={tag}>
                      <div className="flex justify-between text-xs mb-1">
                        <span style={{ color: 'white' }}>{tag}</span>
                        <span style={{ color: '#666' }}>{count}x</span>
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
              <div className="text-sm font-medium mb-4" style={{ color: '#888' }}>TAG-CLOUD</div>
              <div className="flex flex-wrap gap-2">
                {topTags.map(([tag, count]) => {
                  const max = topTags[0]?.[1] || 1
                  const size = 10 + Math.round((count / max) * 8)
                  return (
                    <span key={tag} className="badge badge-purple" style={{ fontSize: size }}>
                      #{tag}
                    </span>
                  )
                })}
              </div>
              <div className="mt-6 pt-4 border-t" style={{ borderColor: '#1e1e1e' }}>
                <div className="text-xs font-medium mb-3" style={{ color: '#888' }}>EMPFEHLUNG</div>
                <p className="text-xs leading-relaxed" style={{ color: '#666' }}>
                  Die Tags <span style={{ color: 'white' }}>{topTags.slice(0,3).map(([t]) => `#${t}`).join(', ')}</span> performen
                  am häufigsten in euren Videos. Nutzt diese konsistent in neuen Uploads für bessere Auffindbarkeit.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
