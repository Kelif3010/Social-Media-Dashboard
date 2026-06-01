'use client'
import { useEffect, useState } from 'react'
import { supabase, CalendarEvent } from '@/lib/supabase'
import { Plus, ChevronLeft, ChevronRight, Trash2 } from 'lucide-react'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, isSameMonth, isToday, parseISO, isSameDay } from 'date-fns'
import { de } from 'date-fns/locale'
import Nav from '@/components/Nav'

const EVENT_TYPES = [
  { value: 'dreh', label: 'Drehtag', color: '#a78bfa', bg: '#1e1535' },
  { value: 'schnitt', label: 'Schnitttag', color: '#fbbf24', bg: '#2e1e05' },
  { value: 'upload', label: 'Upload', color: '#4ecca3', bg: '#0a2e24' },
]

export default function CalendarPage() {
  const [current, setCurrent] = useState(new Date())
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [adding, setAdding] = useState(false)
  const [form, setForm] = useState({ title: '', event_date: '', event_type: 'dreh', notes: '' })

  useEffect(() => { fetchEvents() }, [])

  async function fetchEvents() {
    const { data } = await supabase.from('calendar_events').select('*').order('event_date')
    if (data) setEvents(data)
  }

  async function addEvent() {
    if (!form.title.trim() || !form.event_date) return
    await supabase.from('calendar_events').insert(form)
    setForm({ title: '', event_date: '', event_type: 'dreh', notes: '' })
    setAdding(false)
    fetchEvents()
  }

  async function deleteEvent(id: string) {
    await supabase.from('calendar_events').delete().eq('id', id)
    fetchEvents()
  }

  const monthStart = startOfMonth(current)
  const monthEnd = endOfMonth(current)
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd })
  const startDow = (getDay(monthStart) + 6) % 7

  const upcomingEvents = events
    .filter(e => parseISO(e.event_date) >= new Date())
    .sort((a, b) => a.event_date.localeCompare(b.event_date))
    .slice(0, 8)

  return (
    <div className="flex">
      <Nav />
      <main className="ml-56 flex-1 p-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-semibold mb-1">Kalender</h1>
            <p className="text-sm" style={{ color: '#888' }}>Drehtage, Schnitt & Uploads</p>
          </div>
          <button className="btn btn-red" onClick={() => setAdding(!adding)}>
            <Plus size={15} /> Termin
          </button>
        </div>

        {adding && (
          <div className="card mb-6">
            <h3 className="text-sm font-medium mb-4">Termin hinzufügen</h3>
            <div className="grid grid-cols-3 gap-3 mb-3">
              <div>
                <label className="text-xs mb-1 block" style={{ color: '#888' }}>Titel</label>
                <input placeholder="z.B. Drehtag Stuttgart" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
              </div>
              <div>
                <label className="text-xs mb-1 block" style={{ color: '#888' }}>Datum</label>
                <input type="date" value={form.event_date} onChange={e => setForm({ ...form, event_date: e.target.value })} />
              </div>
              <div>
                <label className="text-xs mb-1 block" style={{ color: '#888' }}>Typ</label>
                <select value={form.event_type} onChange={e => setForm({ ...form, event_type: e.target.value })}>
                  {EVENT_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </div>
            </div>
            <div className="mb-3">
              <label className="text-xs mb-1 block" style={{ color: '#888' }}>Notizen (optional)</label>
              <input placeholder="z.B. Location: Marktplatz Stuttgart" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} />
            </div>
            <div className="flex gap-2">
              <button className="btn btn-red" onClick={addEvent}>Speichern</button>
              <button className="btn" onClick={() => setAdding(false)}>Abbrechen</button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2 card">
            <div className="flex items-center justify-between mb-4">
              <button className="btn p-1.5" onClick={() => setCurrent(new Date(current.getFullYear(), current.getMonth() - 1))}>
                <ChevronLeft size={16} />
              </button>
              <span className="text-sm font-medium">{format(current, 'MMMM yyyy', { locale: de })}</span>
              <button className="btn p-1.5" onClick={() => setCurrent(new Date(current.getFullYear(), current.getMonth() + 1))}>
                <ChevronRight size={16} />
              </button>
            </div>
            <div className="grid grid-cols-7 mb-2">
              {['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'].map(d => (
                <div key={d} className="text-center text-xs py-1" style={{ color: '#555' }}>{d}</div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {Array(startDow).fill(null).map((_, i) => <div key={`e${i}`} />)}
              {days.map(day => {
                const dayEvents = events.filter(e => isSameDay(parseISO(e.event_date), day))
                const today = isToday(day)
                return (
                  <div key={day.toISOString()} className="rounded-lg p-1.5 min-h-12"
                    style={{ background: today ? '#1e1e1e' : 'transparent', border: today ? '1px solid #E63946' : '1px solid transparent' }}>
                    <div className="text-xs mb-1" style={{ color: today ? '#E63946' : isSameMonth(day, current) ? '#888' : '#333' }}>
                      {format(day, 'd')}
                    </div>
                    {dayEvents.map(e => {
                      const et = EVENT_TYPES.find(t => t.value === e.event_type)
                      return (
                        <div key={e.id} className="text-xs rounded px-1 py-0.5 mb-0.5 truncate"
                          style={{ background: et?.bg, color: et?.color }}>
                          {e.title}
                        </div>
                      )
                    })}
                  </div>
                )
              })}
            </div>
            <div className="flex gap-3 mt-4 pt-3 border-t" style={{ borderColor: '#1e1e1e' }}>
              {EVENT_TYPES.map(t => (
                <div key={t.value} className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-sm" style={{ background: t.color }} />
                  <span className="text-xs" style={{ color: '#666' }}>{t.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <h3 className="text-sm font-medium mb-4" style={{ color: '#888' }}>KOMMENDE TERMINE</h3>
            {upcomingEvents.length === 0 ? (
              <p className="text-xs" style={{ color: '#555' }}>Keine geplanten Termine.</p>
            ) : upcomingEvents.map(e => {
              const et = EVENT_TYPES.find(t => t.value === e.event_type)
              return (
                <div key={e.id} className="flex items-start justify-between py-2.5 border-b" style={{ borderColor: '#1e1e1e' }}>
                  <div>
                    <div className="text-sm">{e.title}</div>
                    <div className="text-xs mt-0.5" style={{ color: '#666' }}>
                      {format(parseISO(e.event_date), 'EEE, d. MMM', { locale: de })}
                    </div>
                    <div className="text-xs mt-0.5" style={{ color: et?.color }}>{et?.label}</div>
                  </div>
                  <button className="btn p-1" style={{ color: '#f87171', borderColor: 'transparent' }} onClick={() => deleteEvent(e.id)}>
                    <Trash2 size={12} />
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      </main>
    </div>
  )
}
