'use client'
import { useEffect, useState } from 'react'
import { supabase, VisionItem, Goal } from '@/lib/supabase'
import { Plus, Trash2, Target, Star } from 'lucide-react'
import { format, parseISO } from 'date-fns'
import { de } from 'date-fns/locale'
import Nav from '@/components/Nav'

const VISION_CATS = ['Subscriber', 'Views', 'Monetarisierung', 'Equipment', 'Kooperation', 'Persönlich', 'Reise', 'Lifestyle']
const GOAL_CATS = ['Subscriber', 'Views', 'Videos', 'Kooperation', 'Equipment', 'Finanzen', 'Persönlich']
const EMOJIS = ['🎯', '🚀', '❤️', '🌍', '🎥', '💪', '✈️', '🍳', '💰', '🏆', '⭐', '🔥']

const catColors: Record<string, string> = {
  Subscriber: 'badge-teal', Views: 'badge-blue', Monetarisierung: 'badge-amber',
  Equipment: 'badge-gray', Kooperation: 'badge-purple', Persönlich: 'badge-red',
  Reise: 'badge-teal', Lifestyle: 'badge-purple', Videos: 'badge-blue',
  Finanzen: 'badge-amber',
}

export default function VisionPage() {
  const [visions, setVisions] = useState<VisionItem[]>([])
  const [goals, setGoals] = useState<Goal[]>([])
  const [tab, setTab] = useState<'vision' | 'goals'>('vision')
  const [adding, setAdding] = useState(false)
  const [vForm, setVForm] = useState({ title: '', description: '', category: 'Persönlich', deadline: '', emoji: '🎯' })
  const [gForm, setGForm] = useState({ title: '', category: 'Subscriber', target_value: '', deadline: '', description: '' })

  useEffect(() => { fetchAll() }, [])

  async function fetchAll() {
    const [{ data: v }, { data: g }] = await Promise.all([
      supabase.from('vision_board').select('*').order('created_at', { ascending: false }),
      supabase.from('goals').select('*').order('created_at', { ascending: false }),
    ])
    if (v) setVisions(v)
    if (g) setGoals(g)
  }

  async function addVision() {
    if (!vForm.title.trim()) return
    await supabase.from('vision_board').insert({ ...vForm, deadline: vForm.deadline || null })
    setVForm({ title: '', description: '', category: 'Persönlich', deadline: '', emoji: '🎯' })
    setAdding(false)
    fetchAll()
  }

  async function addGoal() {
    if (!gForm.title.trim()) return
    await supabase.from('goals').insert({
      ...gForm,
      target_value: gForm.target_value ? parseInt(gForm.target_value) : null,
      deadline: gForm.deadline || null,
    })
    setGForm({ title: '', category: 'Subscriber', target_value: '', deadline: '', description: '' })
    setAdding(false)
    fetchAll()
  }

  async function toggleGoal(id: string, achieved: boolean) {
    await supabase.from('goals').update({ achieved: !achieved }).eq('id', id)
    fetchAll()
  }

  async function deleteItem(table: string, id: string) {
    await supabase.from(table).delete().eq('id', id)
    fetchAll()
  }

  return (
    <div className="flex">
      <Nav />
      <main className="ml-56 flex-1 p-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-semibold mb-1">Vision & Ziele</h1>
            <p className="text-sm" style={{ color: '#888' }}>Euer Weg als Kanal und als Paar</p>
          </div>
          <button className="btn btn-red" onClick={() => setAdding(!adding)}>
            <Plus size={15} /> Hinzufügen
          </button>
        </div>

        <div className="flex gap-2 mb-6">
          <button className="btn" style={tab === 'vision' ? { background: '#1e1e1e', color: 'white' } : {}} onClick={() => setTab('vision')}>
            <Star size={14} /> Vision Board
          </button>
          <button className="btn" style={tab === 'goals' ? { background: '#1e1e1e', color: 'white' } : {}} onClick={() => setTab('goals')}>
            <Target size={14} /> Ziele & KPIs
          </button>
        </div>

        {adding && tab === 'vision' && (
          <div className="card mb-6">
            <h3 className="text-sm font-medium mb-4">Vision hinzufügen</h3>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label className="text-xs mb-1 block" style={{ color: '#888' }}>Titel</label>
                <input placeholder="z.B. 10.000 Abonnenten auf YouTube" value={vForm.title} onChange={e => setVForm({ ...vForm, title: e.target.value })} />
              </div>
              <div>
                <label className="text-xs mb-1 block" style={{ color: '#888' }}>Kategorie</label>
                <select value={vForm.category} onChange={e => setVForm({ ...vForm, category: e.target.value })}>
                  {VISION_CATS.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div className="mb-3">
              <label className="text-xs mb-1 block" style={{ color: '#888' }}>Motivation / Beschreibung</label>
              <textarea placeholder="Warum ist dieses Ziel wichtig für euch?" value={vForm.description} onChange={e => setVForm({ ...vForm, description: e.target.value })} rows={2} />
            </div>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label className="text-xs mb-1 block" style={{ color: '#888' }}>Deadline (optional)</label>
                <input type="date" value={vForm.deadline} onChange={e => setVForm({ ...vForm, deadline: e.target.value })} />
              </div>
              <div>
                <label className="text-xs mb-1 block" style={{ color: '#888' }}>Emoji</label>
                <div className="flex flex-wrap gap-1.5">
                  {EMOJIS.map(em => (
                    <button key={em} className="text-lg rounded p-1" style={{ background: vForm.emoji === em ? '#2e2e2e' : 'transparent' }}
                      onClick={() => setVForm({ ...vForm, emoji: em })}>{em}</button>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="btn btn-red" onClick={addVision}>Speichern</button>
              <button className="btn" onClick={() => setAdding(false)}>Abbrechen</button>
            </div>
          </div>
        )}

        {adding && tab === 'goals' && (
          <div className="card mb-6">
            <h3 className="text-sm font-medium mb-4">Ziel / KPI hinzufügen</h3>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label className="text-xs mb-1 block" style={{ color: '#888' }}>Titel</label>
                <input placeholder="z.B. 100 Videos hochladen" value={gForm.title} onChange={e => setGForm({ ...gForm, title: e.target.value })} />
              </div>
              <div>
                <label className="text-xs mb-1 block" style={{ color: '#888' }}>Kategorie</label>
                <select value={gForm.category} onChange={e => setGForm({ ...gForm, category: e.target.value })}>
                  {GOAL_CATS.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label className="text-xs mb-1 block" style={{ color: '#888' }}>Zielwert (optional)</label>
                <input type="number" placeholder="z.B. 10000" value={gForm.target_value} onChange={e => setGForm({ ...gForm, target_value: e.target.value })} />
              </div>
              <div>
                <label className="text-xs mb-1 block" style={{ color: '#888' }}>Deadline</label>
                <input type="date" value={gForm.deadline} onChange={e => setGForm({ ...gForm, deadline: e.target.value })} />
              </div>
            </div>
            <div className="mb-3">
              <label className="text-xs mb-1 block" style={{ color: '#888' }}>Beschreibung</label>
              <input placeholder="Details zum Ziel" value={gForm.description} onChange={e => setGForm({ ...gForm, description: e.target.value })} />
            </div>
            <div className="flex gap-2">
              <button className="btn btn-red" onClick={addGoal}>Speichern</button>
              <button className="btn" onClick={() => setAdding(false)}>Abbrechen</button>
            </div>
          </div>
        )}

        {tab === 'vision' && (
          <div className="grid grid-cols-3 gap-4">
            {visions.length === 0 ? (
              <div className="col-span-3 text-center py-12" style={{ color: '#555' }}>
                <Star size={32} className="mx-auto mb-3 opacity-30" />
                <p className="text-sm">Noch keine Visionen — fügt eure erste hinzu.</p>
              </div>
            ) : visions.map(v => (
              <div key={v.id} className="card" style={{ position: 'relative' }}>
                <button className="btn p-1" style={{ position: 'absolute', top: 12, right: 12, color: '#555', borderColor: 'transparent' }}
                  onClick={() => deleteItem('vision_board', v.id)}>
                  <Trash2 size={13} />
                </button>
                <div className="text-3xl mb-3">{v.emoji}</div>
                <span className={`badge ${catColors[v.category] || 'badge-gray'} mb-3`}>{v.category}</span>
                <h3 className="text-sm font-medium mb-2">{v.title}</h3>
                {v.description && <p className="text-xs leading-relaxed mb-3" style={{ color: '#777' }}>{v.description}</p>}
                {v.deadline && <p className="text-xs" style={{ color: '#555' }}>Bis {format(parseISO(v.deadline), 'd. MMMM yyyy', { locale: de })}</p>}
              </div>
            ))}
          </div>
        )}

        {tab === 'goals' && (
          <div className="flex flex-col gap-3">
            {goals.length === 0 ? (
              <div className="text-center py-12" style={{ color: '#555' }}>
                <Target size={32} className="mx-auto mb-3 opacity-30" />
                <p className="text-sm">Noch keine Ziele — fügt euer erstes hinzu.</p>
              </div>
            ) : goals.map(g => (
              <div key={g.id} className="card flex items-center gap-4">
                <button onClick={() => toggleGoal(g.id, g.achieved)} className="flex-shrink-0 w-5 h-5 rounded border flex items-center justify-center"
                  style={{ border: g.achieved ? '1px solid #4ecca3' : '1px solid #444', background: g.achieved ? '#0a2e24' : 'transparent' }}>
                  {g.achieved && <span style={{ color: '#4ecca3', fontSize: 11 }}>✓</span>}
                </button>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium" style={{ textDecoration: g.achieved ? 'line-through' : 'none', color: g.achieved ? '#555' : 'white' }}>
                      {g.title}
                    </span>
                    <span className={`badge ${catColors[g.category] || 'badge-gray'}`}>{g.category}</span>
                  </div>
                  {g.description && <p className="text-xs" style={{ color: '#666' }}>{g.description}</p>}
                  {g.deadline && <p className="text-xs mt-1" style={{ color: '#555' }}>Deadline: {format(parseISO(g.deadline), 'd. MMMM yyyy', { locale: de })}</p>}
                </div>
                {g.target_value && (
                  <div className="text-right">
                    <div className="text-lg font-semibold">{g.target_value.toLocaleString('de-DE')}</div>
                    <div className="text-xs" style={{ color: '#555' }}>Zielwert</div>
                  </div>
                )}
                <button className="btn p-1" style={{ color: '#555', borderColor: 'transparent' }} onClick={() => deleteItem('goals', g.id)}>
                  <Trash2 size={13} />
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
