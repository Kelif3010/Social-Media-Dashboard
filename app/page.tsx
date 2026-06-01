'use client'
import { useEffect, useState } from 'react'
import { supabase, SubscriberEntry, CalendarEvent, Milestone } from '@/lib/supabase'
import { TrendingUp, Youtube, Instagram, Music, Calendar, Award, Plus } from 'lucide-react'
import { format, parseISO, isAfter, startOfToday } from 'date-fns'
import { de } from 'date-fns/locale'
import Nav from '@/components/Nav'

const PLATFORMS = [
  { key: 'YouTube', icon: Youtube, color: '#E63946', badge: 'badge-red' },
  { key: 'Instagram', icon: Instagram, color: '#a78bfa', badge: 'badge-purple' },
  { key: 'TikTok', icon: Music, color: '#fbbf24', badge: 'badge-amber' },
]

export default function Overview() {
  const [latest, setLatest] = useState<Record<string, number>>({})
  const [goals, setGoals] = useState<Record<string, number>>({})
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [milestones, setMilestones] = useState<Milestone[]>([])
  const [adding, setAdding] = useState(false)
  const [form, setForm] = useState({ platform: 'YouTube', count: '', goal: '' })
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchAll() }, [])

  async function fetchAll() {
    setLoading(true)
    const [{ data: subData }, { data: evData }, { data: msData }] = await Promise.all([
      supabase.from('subscriber_history').select('*').order('recorded_at', { ascending: false }),
      supabase.from('calendar_events').select('*').order('event_date', { ascending: true }),
      supabase.from('milestones').select('*').order('value', { ascending: true }),
    ])
    if (subData) {
      const latestMap: Record<string, number> = {}
      const goalMap: Record<string, number> = {}
      subData.forEach(e => {
        if (!latestMap[e.platform]) latestMap[e.platform] = e.count
      })
      subData.forEach(e => {
        if (e.platform.endsWith('_goal') && !goalMap[e.platform.replace('_goal','')]) {
          goalMap[e.platform.replace('_goal','')] = e.count
        }
      })
      setLatest(latestMap)
    }
    if (evData) {
      const today = startOfToday()
      setEvents(evData.filter(e => isAfter(parseISO(e.event_date), today) || e.event_date === format(today, 'yyyy-MM-dd')).slice(0,5))
    }
    if (msData) setMilestones(msData)
    setLoading(false)
  }

  async function saveStats() {
    if (!form.count) return
    const entries = [{ platform: form.platform, count: parseInt(form.count), recorded_at: format(new Date(), 'yyyy-MM-dd') }]
    if (form.goal) entries.push({ platform: `${form.platform}_goal`, count: parseInt(form.goal), recorded_at: format(new Date(), 'yyyy-MM-dd') })
    await supabase.from('subscriber_history').insert(entries)
    setAdding(false)
    setForm({ platform: 'YouTube', count: '', goal: '' })
    fetchAll()
  }

  async function markMilestone(id: string) {
    await supabase.from('milestones').update({ achieved_at: format(new Date(), 'yyyy-MM-dd') }).eq('id', id)
    fetchAll()
  }

  const eventTypeLabel: Record<string, string> = { dreh: 'Drehtag', schnitt: 'Schnitttag', upload: 'Upload' }
  const eventBadge: Record<string, string> = { dreh: 'badge-purple', schnitt: 'badge-amber', upload: 'badge-teal' }

  if (loading) return (
    <div className="flex">
      <Nav />
      <main className="ml-56 flex-1 p-8 flex items-center justify-center min-h-screen">
        <div className="text-sm" style={{ color: '#555' }}>Wird geladen...</div>
      </main>
    </div>
  )

  return (
    <div className="flex">
      <Nav />
      <main className="ml-56 flex-1 p-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold mb-1">Guten Tag, Ken & Elif 👋</h1>
          <p className="text-sm" style={{ color: '#888' }}>{format(new Date(), "EEEE, d. MMMM yyyy", { locale: de })}</p>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          {PLATFORMS.map(({ key, icon: Icon, color }) => {
            const count = latest[key] || 0
            const goal = latest[`${key}_goal`] || 0
            const pct = goal ? Math.min(100, Math.round((count / goal) * 100)) : 0
            return (
              <div key={key} className="card">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Icon size={16} style={{ color }} />
                    <span className="text-sm font-medium">{key}</span>
                  </div>
                  <TrendingUp size={13} style={{ color: '#555' }} />
                </div>
                <div className="text-3xl font-semibold mb-1">{count.toLocaleString('de-DE')}</div>
                <div className="text-xs mb-3" style={{ color: '#666' }}>Abonnenten / Follower</div>
                {goal > 0 && (
                  <>
                    <div className="progress-bar-bg mb-1">
                      <div className="progress-bar-fill" style={{ width: `${pct}%`, background: color }} />
                    </div>
                    <div className="text-xs" style={{ color: '#555' }}>{pct}% von {goal.toLocaleString('de-DE')} Ziel</div>
                  </>
                )}
              </div>
            )
          })}
        </div>

        <div className="flex justify-between items-center mb-3">
          <h2 className="text-sm font-medium" style={{ color: '#888' }}>ZAHLEN AKTUALISIEREN</h2>
          <button className="btn text-xs py-1.5 px-3" onClick={() => setAdding(!adding)}>
            <Plus size={13} /> Eintragen
          </button>
        </div>

        {adding && (
          <div className="card mb-6">
            <div className="grid grid-cols-3 gap-3 mb-3">
              <div>
                <label className="text-xs mb-1 block" style={{ color: '#888' }}>Plattform</label>
                <select value={form.platform} onChange={e => setForm({ ...form, platform: e.target.value })}>
                  <option>YouTube</option><option>Instagram</option><option>TikTok</option>
                </select>
              </div>
              <div>
                <label className="text-xs mb-1 block" style={{ color: '#888' }}>Aktuelle Follower</label>
                <input type="number" placeholder="z.B. 1250" value={form.count} onChange={e => setForm({ ...form, count: e.target.value })} />
              </div>
              <div>
                <label className="text-xs mb-1 block" style={{ color: '#888' }}>Nächstes Ziel (optional)</label>
                <input type="number" placeholder="z.B. 5000" value={form.goal} onChange={e => setForm({ ...form, goal: e.target.value })} />
              </div>
            </div>
            <button className="btn btn-red" onClick={saveStats}>Speichern</button>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="card">
            <div className="flex items-center gap-2 mb-4">
              <Calendar size={15} style={{ color: '#888' }} />
              <span className="text-sm font-medium">Nächste Termine</span>
            </div>
            {events.length === 0 ? (
              <p className="text-xs" style={{ color: '#555' }}>Keine Termine — im Kalender hinzufügen.</p>
            ) : events.map(e => (
              <div key={e.id} className="flex items-center justify-between py-2 border-b" style={{ borderColor: '#1e1e1e' }}>
                <div>
                  <div className="text-sm">{e.title}</div>
                  <div className="text-xs mt-0.5" style={{ color: '#666' }}>
                    {format(parseISO(e.event_date), 'd. MMM', { locale: de })}
                  </div>
                </div>
                <span className={`badge ${eventBadge[e.event_type]}`}>{eventTypeLabel[e.event_type]}</span>
              </div>
            ))}
          </div>

          <div className="card">
            <div className="flex items-center gap-2 mb-4">
              <Award size={15} style={{ color: '#888' }} />
              <span className="text-sm font-medium">Meilensteine</span>
            </div>
            <div className="flex flex-col gap-1.5 max-h-48 overflow-y-auto">
              {milestones.map(m => (
                <div key={m.id} className="flex items-center justify-between py-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs" style={{ color: m.achieved_at ? '#4ecca3' : '#555' }}>
                      {m.achieved_at ? '✓' : '○'}
                    </span>
                    <span className="text-sm" style={{ color: m.achieved_at ? '#888' : 'white', textDecoration: m.achieved_at ? 'line-through' : 'none' }}>
                      {m.platform} {m.value.toLocaleString('de-DE')}
                    </span>
                  </div>
                  {!m.achieved_at && (
                    <button className="btn text-xs py-1 px-2" onClick={() => markMilestone(m.id)}>Erreicht!</button>
                  )}
                  {m.achieved_at && (
                    <span className="text-xs" style={{ color: '#555' }}>{format(parseISO(m.achieved_at), 'd. MMM yy', { locale: de })}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
