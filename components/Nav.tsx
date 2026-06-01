'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Kanban, Calendar, Target, Clock, CheckSquare, Play, BarChart2 } from 'lucide-react'

const nav = [
  { href: '/', icon: LayoutDashboard, label: 'Übersicht' },
  { href: '/analytics', icon: BarChart2, label: 'YouTube Analytics' },
  { href: '/pipeline', icon: Kanban, label: 'Pipeline' },
  { href: '/calendar', icon: Calendar, label: 'Kalender' },
  { href: '/vision', icon: Target, label: 'Vision & Ziele' },
  { href: '/timeline', icon: Clock, label: 'Video-Timeline' },
  { href: '/checklist', icon: CheckSquare, label: 'Dreh-Checkliste' },
]

export default function Nav() {
  const pathname = usePathname()
  return (
    <nav className="fixed top-0 left-0 h-full w-56 border-r border-kelif-border bg-kelif-card flex flex-col z-50"
      style={{ borderColor: '#222' }}>
      <div className="p-5 border-b" style={{ borderColor: '#222' }}>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: '#E63946' }}>
            <Play size={14} fill="white" color="white" />
          </div>
          <div>
            <div className="font-semibold text-sm">Kelif HQ</div>
            <div className="text-xs" style={{ color: '#888' }}>Creator Dashboard</div>
          </div>
        </div>
      </div>
      <div className="flex-1 p-3 flex flex-col gap-1">
        {nav.map(({ href, icon: Icon, label }) => {
          const active = pathname === href
          return (
            <Link key={href} href={href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all"
              style={{
                background: active ? '#1e1e1e' : 'transparent',
                color: active ? 'white' : '#888',
                borderLeft: active ? '2px solid #E63946' : '2px solid transparent',
              }}>
              <Icon size={16} />
              {label}
            </Link>
          )
        })}
      </div>
      <div className="p-4 border-t" style={{ borderColor: '#222' }}>
        <div className="text-xs" style={{ color: '#555' }}>Elfi & Ken • Kelif</div>
        <div className="text-xs" style={{ color: '#444' }}>Stuttgart / Ludwigsburg</div>
      </div>
    </nav>
  )
}
