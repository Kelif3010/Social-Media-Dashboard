'use client'
import { useEffect, useState } from 'react'
import { supabase, VisionItem, Goal } from '@/lib/supabase'
import { Plus, Trash2, Target, Star } from 'lucide-react'
import { format, parseISO } from 'date-fns'
import { de } from 'date-fns/locale'

const VISION_CATS = ['Subscriber', 'Views', 'Monetarisierung', 'Equipment', 'Kooperation', 'Persönlich', 'Reise', 'Lifestyle']
const GOAL_CATS = ['Subscriber', 'Views', 'Videos', 'Kooperation', 'Equipment', 'Finanzen', 'Persönlich']
const EMOJIS = ['🎯', '🚀', '❤️', '🌍', '🎥', '💪', '✈️', '🍳', '💰', '🏆', '⭐', '🔥']

const catColors: Record<string, string> = {
  Subscriber: 'badge-teal', Views: 'badge-blue', Monetarisierung: 'badge-amber',
  Equipment: 'badge-gray', Kooperation: 'badge-purple', Persönlich: 'badge-red',
  Reise: 'badge-teal', Lifestyle: 'badge-purple', Videos: 'badge-blue', Finanzen: 'badge-amber',
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

  const doneGoals = goals.filter(g => g.achieved).length
  const totalGoals = goals.length

  return (
    <main className="page">
      <div className="flex justify-between items-center mb-5">
        <div>
          <h1 className="text-xl font-semibold mb-0.5">Vision & Ziele</h1>
          <p className="text-xs" style={{ color: '#666' }}>Euer Weg als Kanal und als Paar</p>
        </div>
        <button className="btn btn-red text-sm" onClick={() => setAdding(!adding)}>
          <Plus size={15} /> Neu
        </button>
      </div>

      {/* Tab switcher */}
      <div className="flex gap-2 mb-5 p-1 rounded-xl" style={{ background: '#141414' }}>
        <button
          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-medium transition-all"
          style={{ background: tab === 'vision' ? '#1e1e1e' : 'transparent', color: tab === 'vision' ? 'white' : '#666' }}
          onClick={() => setTab('vision')}
        >
          <Star size={14} /> Vision Board
        </button>
        <button
          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-medium transition-all"
          style={{ background: tab === 'goals' ? '#1e1e1e' : 'transparent', color: tab === 'goals' ? 'white' : '#666' }}
          onClick={() => setTab('goals')}
        >
          <Target size={14} /> Ziele {totalGoals > 0 && `${doneGoals}/${totalGoals}`}
        </button>
      </div>

      {/* Add forms */}
      {adding && tab === 'vision' && (
        <div className="card mb-5">
          <h3 className="text-sm font-medium mb-4">Vision hinzufügen</h3>
          <div className="flex flex-col gap-3 mb-3">
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
            <div>
              <label className="text-xs mb-1 block" style={{ color: '#888' }}>Motivation / Beschreibung</label>
              <textarea placeholder="Warum ist dieses Ziel wichtig für euch?" value={vForm.description} onChange={e => setVForm({ ...vForm, description: e.target.value })} rows={2} />
            </div>
            <div>
              <label className="text-xs mb-1 block" style={{ color: '#888' }}>Deadline (optional)</label>
              <input type="date" value={vForm.deadline} onChange={e => setVForm({ ...vForm, deadline: e.target.value })} />
            </div>
            <div>
              <label className="text-xs mb-1 block" style={{ color: '#888' }}>Emoji</label>
              <div className="flex flex-wrap gap-2">
                {EMOJIS.map(em => (
                  <button key={em} className="text-xl rounded-lg p-1.5" style={{ background: vForm.emoji === em ? '#2e2e2e' : 'transparent' }}
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
        <div className="card mb-5">
          <h3 className="text-sm font-medium mb-4">Ziel hinzufügen</h3>
          <div className="flex flex-col gap-3 mb-3">
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
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs mb-1 block" style={{ color: '#888' }}>Zielwert</label>
                <input type="number" inputMode="numeric" placeholder="z.B. 10000" value={gForm.target_value} onChange={e => setGForm({ ...gForm, target_value: e.target.value })} />
              </div>
              <div>
                <label className="text-xs mb-1 block" style={{ color: '#888' }}>Deadline</label>
                <input type="date" value={gForm.deadline} onChange={e => setGForm({ ...gForm, deadline: e.target.value })} />
              </div>
            </div>
            <div>
              <label className="text-xs mb-1 block" style={{ color: '#888' }}>Beschreibung</label>
              <input placeholder="Details zum Ziel" value={gForm.description} onChange={e => setGForm({ ...gForm, description: e.target.value })} />
            </div>
          </div>
          <div className="flex gap-2">
            <button className="btn btn-red" onClick={addGoal}>Speichern</button>
            <button className="btn" onClick={() => setAdding(false)}>Abbrechen</button>
          </div>
        </div>
      )}

      {/* Vision Board */}
      {tab === 'vision' && (
        <div className="grid grid-cols-2 gap-3 mb-6">
          {visions.length === 0 ? (
            <div className="col-span-2 text-center py-12" style={{ color: '#555' }}>
              <Star size={28} className="mx-auto mb-3 opacity-30" />
              <p className="text-sm">Noch keine Visionen — fügt eure erste hinzu.</p>
            </div>
          ) : visions.map(v => (
            <div key={v.id} className="card" style={{ position: 'relative' }}>
              <button className="btn p-1" style={{ position: 'absolute', top: 10, right: 10, color: '#444', borderColor: 'transparent' }}
                onClick={() => deleteItem('vision_board', v.id)}>
                <Trash2 size={12} />
              </button>
              <div className="text-2xl mb-2">{v.emoji}</div>
              <span className={`badge ${catColors[v.category] || 'badge-gray'} mb-2`}>{v.category}</span>
              <h3 className="text-sm font-medium mt-2 mb-1 pr-4">{v.title}</h3>
              {v.description && <p className="text-xs leading-relaxed" style={{ color: '#777' }}>{v.description}</p>}
              {v.deadline && <p className="text-xs mt-2" style={{ color: '#555' }}>Bis {format(parseISO(v.deadline), 'd. MMM yyyy', { locale: de })}</p>}
            </div>
          ))}
        </div>
      )}

      {/* Goals */}
      {tab === 'goals' && (
        <div className="flex flex-col gap-3 mb-6">
          {goals.length === 0 ? (
            <div className="text-center py-12" style={{ color: '#555' }}>
              <Target size={28} className="mx-auto mb-3 opacity-30" />
              <p className="text-sm">Noch keine Ziele — fügt euer erstes hinzu.</p>
            </div>
          ) : goals.map(g => (
            <div key={g.id} className="card flex items-start gap-3">
              <button onClick={() => toggleGoal(g.id, g.achieved)} className="flex-shrink-0 w-5 h-5 rounded border flex items-center justify-center mt-0.5"
                style={{ border: g.achieved ? '1px solid #4ecca3' : '1px solid #444', background: g.achieved ? '#0a2e24' : 'transparent' }}>
                {g.achieved && <span style={{ color: '#4ecca3', fontSize: 11 }}>✓</span>}
              </button>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="text-sm font-medium" style={{ textDecoration: g.achieved ? 'line-through' : 'none', color: g.achieved ? '#555' : 'white' }}>
                    {g.title}
                  </span>
                  <span className={`badge ${catColors[g.category] || 'badge-gray'}`}>{g.category}</span>
                </div>
                {g.description && <p className="text-xs" style={{ color: '#666' }}>{g.description}</p>}
                {g.deadline && <p className="text-xs mt-1" style={{ color: '#555' }}>Deadline: {format(parseISO(g.deadline), 'd. MMMM yyyy', { locale: de })}</p>}
                {g.target_value && (
                  <p className="text-xs mt-1 font-semibold" style={{ color: '#888' }}>Ziel: {g.target_value.toLocaleString('de-DE')}</p>
                )}
              </div>
              <button className="btn p-1" style={{ color: '#444', borderColor: 'transparent', flexShrink: 0 }} onClick={() => deleteItem('goals', g.id)}>
                <Trash2 size={13} />
              </button>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}
