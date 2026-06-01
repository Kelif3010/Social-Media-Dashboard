'use client'
import { useEffect, useState } from 'react'
import { supabase, ChecklistItem } from '@/lib/supabase'
import { CheckSquare, Square, RotateCcw, Plus, Trash2 } from 'lucide-react'
import Nav from '@/components/Nav'

const CATS = ['Equipment', 'Audio', 'Speicher', 'Content', 'Settings']
const catColors: Record<string, string> = {
  Equipment: 'badge-blue', Audio: 'badge-purple', Speicher: 'badge-amber',
  Content: 'badge-teal', Settings: 'badge-gray'
}

export default function Checklist() {
  const [items, setItems] = useState<ChecklistItem[]>([])
  const [checked, setChecked] = useState<Set<string>>(new Set())
  const [adding, setAdding] = useState(false)
  const [form, setForm] = useState({ label: '', category: 'Equipment' })

  useEffect(() => { fetchItems() }, [])

  async function fetchItems() {
    const { data } = await supabase.from('shoot_checklist').select('*').order('sort_order')
    if (data) setItems(data)
  }

  async function addItem() {
    if (!form.label.trim()) return
    const maxOrder = Math.max(...items.map(i => i.sort_order), 0)
    await supabase.from('shoot_checklist').insert({ ...form, sort_order: maxOrder + 1 })
    setForm({ label: '', category: 'Equipment' })
    setAdding(false)
    fetchItems()
  }

  async function deleteItem(id: string) {
    await supabase.from('shoot_checklist').delete().eq('id', id)
    fetchItems()
  }

  function toggle(id: string) {
    setChecked(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const checkedCount = checked.size
  const total = items.length
  const pct = total ? Math.round((checkedCount / total) * 100) : 0
  const allDone = checkedCount === total && total > 0

  const grouped = CATS.reduce((acc, cat) => {
    acc[cat] = items.filter(i => i.category === cat)
    return acc
  }, {} as Record<string, ChecklistItem[]>)

  return (
    <div className="flex">
      <Nav />
      <main className="ml-56 flex-1 p-8 max-w-2xl">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-semibold mb-1">Dreh-Checkliste</h1>
            <p className="text-sm" style={{ color: '#888' }}>Vor jedem Dreh abhaken — nie wieder was vergessen</p>
          </div>
          <div className="flex gap-2">
            <button className="btn" onClick={() => setChecked(new Set())}>
              <RotateCcw size={14} /> Reset
            </button>
            <button className="btn btn-red" onClick={() => setAdding(!adding)}>
              <Plus size={14} /> Punkt
            </button>
          </div>
        </div>

        <div className="card mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">{checkedCount} / {total} erledigt</span>
            <span className="text-sm font-semibold" style={{ color: allDone ? '#4ecca3' : '#E63946' }}>{pct}%</span>
          </div>
          <div className="progress-bar-bg">
            <div className="progress-bar-fill" style={{ width: `${pct}%`, background: allDone ? '#4ecca3' : '#E63946' }} />
          </div>
          {allDone && (
            <div className="mt-3 text-sm text-center" style={{ color: '#4ecca3' }}>
              ✓ Alles ready — viel Spaß beim Dreh! 🎥
            </div>
          )}
        </div>

        {adding && (
          <div className="card mb-6">
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label className="text-xs mb-1 block" style={{ color: '#888' }}>Bezeichnung</label>
                <input placeholder="z.B. Gimbal geladen" value={form.label} onChange={e => setForm({ ...form, label: e.target.value })} />
              </div>
              <div>
                <label className="text-xs mb-1 block" style={{ color: '#888' }}>Kategorie</label>
                <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                  {CATS.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="btn btn-red" onClick={addItem}>Hinzufügen</button>
              <button className="btn" onClick={() => setAdding(false)}>Abbrechen</button>
            </div>
          </div>
        )}

        {CATS.map(cat => {
          const catItems = grouped[cat]
          if (!catItems?.length) return null
          return (
            <div key={cat} className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <span className={`badge ${catColors[cat]}`}>{cat}</span>
                <span className="text-xs" style={{ color: '#555' }}>
                  {catItems.filter(i => checked.has(i.id)).length}/{catItems.length}
                </span>
              </div>
              <div className="card" style={{ padding: '8px 16px' }}>
                {catItems.map(item => {
                  const done = checked.has(item.id)
                  return (
                    <div key={item.id} className="flex items-center gap-3 py-2.5 border-b" style={{ borderColor: '#1a1a1a' }}>
                      <button onClick={() => toggle(item.id)} className="flex-shrink-0"
                        style={{ color: done ? '#4ecca3' : '#444' }}>
                        {done ? <CheckSquare size={18} /> : <Square size={18} />}
                      </button>
                      <span className="flex-1 text-sm" style={{ color: done ? '#555' : 'white', textDecoration: done ? 'line-through' : 'none' }}>
                        {item.label}
                      </span>
                      <button className="btn p-1" style={{ color: '#444', borderColor: 'transparent' }} onClick={() => deleteItem(item.id)}>
                        <Trash2 size={12} />
                      </button>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </main>
    </div>
  )
}
