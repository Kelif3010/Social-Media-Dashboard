'use client'
import { useEffect, useState } from 'react'
import { supabase, ChecklistItem } from '@/lib/supabase'
import { CheckSquare, Square, RotateCcw, Plus, Trash2 } from 'lucide-react'

const CATS = ['Equipment', 'Audio', 'Speicher', 'Content', 'Settings']
const catColors: Record<string, string> = {
  Equipment: 'badge-blue', Audio: 'badge-purple', Speicher: 'badge-amber',
  Content: 'badge-teal', Settings: 'badge-gray'
}

export default function Checklist() {
  const [items, setItems] = useState<ChecklistItem[]>([])
  const [adding, setAdding] = useState(false)
  const [form, setForm] = useState({ label: '', category: 'Equipment' })
  const [saving, setSaving] = useState<string | null>(null)

  useEffect(() => { fetchItems() }, [])

  async function fetchItems() {
    const { data } = await supabase.from('shoot_checklist').select('*').order('sort_order')
    if (data) setItems(data)
  }

  async function addItem() {
    if (!form.label.trim()) return
    const maxOrder = Math.max(...items.map(i => i.sort_order), 0)
    await supabase.from('shoot_checklist').insert({ ...form, sort_order: maxOrder + 1, checked: false })
    setForm({ label: '', category: 'Equipment' })
    setAdding(false)
    fetchItems()
  }

  async function deleteItem(id: string) {
    await supabase.from('shoot_checklist').delete().eq('id', id)
    fetchItems()
  }

  async function toggle(id: string, current: boolean) {
    setSaving(id)
    await supabase.from('shoot_checklist').update({ checked: !current }).eq('id', id)
    setItems(prev => prev.map(i => i.id === id ? { ...i, checked: !current } : i))
    setSaving(null)
  }

  async function resetAll() {
    await supabase.from('shoot_checklist').update({ checked: false }).eq('checked', true)
    setItems(prev => prev.map(i => ({ ...i, checked: false })))
  }

  const checkedCount = items.filter(i => i.checked).length
  const total = items.length
  const pct = total ? Math.round((checkedCount / total) * 100) : 0
  const allDone = checkedCount === total && total > 0

  const grouped = CATS.reduce((acc, cat) => {
    acc[cat] = items.filter(i => i.category === cat)
    return acc
  }, {} as Record<string, ChecklistItem[]>)

  return (
    <main className="page">
      <div className="flex justify-between items-center mb-5">
        <div>
          <h1 className="text-xl font-semibold mb-0.5">Dreh-Checkliste</h1>
          <p className="text-xs" style={{ color: '#666' }}>Vor jedem Dreh abhaken</p>
        </div>
        <div className="flex gap-2">
          <button className="btn text-sm" onClick={resetAll}>
            <RotateCcw size={14} />
          </button>
          <button className="btn btn-red text-sm" onClick={() => setAdding(!adding)}>
            <Plus size={14} />
          </button>
        </div>
      </div>

      {/* Progress */}
      <div className="card mb-5">
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
        <div className="card mb-5">
          <div className="flex flex-col gap-3 mb-3">
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
        const doneCat = catItems.filter(i => i.checked).length
        return (
          <div key={cat} className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <span className={`badge ${catColors[cat]}`}>{cat}</span>
              <span className="text-xs" style={{ color: '#555' }}>{doneCat}/{catItems.length}</span>
            </div>
            <div className="card" style={{ padding: '4px 16px' }}>
              {catItems.map(item => (
                <div key={item.id} className="flex items-center gap-3 py-3 border-b" style={{ borderColor: '#1a1a1a' }}>
                  <button
                    onClick={() => toggle(item.id, item.checked)}
                    disabled={saving === item.id}
                    style={{ color: item.checked ? '#4ecca3' : '#444', flexShrink: 0 }}
                  >
                    {item.checked ? <CheckSquare size={20} /> : <Square size={20} />}
                  </button>
                  <span className="flex-1 text-sm" style={{ color: item.checked ? '#555' : 'white', textDecoration: item.checked ? 'line-through' : 'none' }}>
                    {item.label}
                  </span>
                  <button className="btn p-1" style={{ color: '#383838', borderColor: 'transparent' }} onClick={() => deleteItem(item.id)}>
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )
      })}

      <div className="mb-6" />
    </main>
  )
}
