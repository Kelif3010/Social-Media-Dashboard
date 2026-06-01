'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, Kanban, Calendar, Target,
  Clock, CheckSquare, BarChart2, Play
} from 'lucide-react'

const nav = [
  { href: '/',            icon: LayoutDashboard, label: 'Übersicht',       short: 'Home'      },
  { href: '/analytics',   icon: BarChart2,       label: 'YouTube Analytics',short: 'Analytics' },
  { href: '/pipeline',    icon: Kanban,          label: 'Pipeline',         short: 'Pipeline'  },
  { href: '/calendar',    icon: Calendar,        label: 'Kalender',         short: 'Kalender'  },
  { href: '/vision',      icon: Target,          label: 'Vision & Ziele',   short: 'Vision'    },
  { href: '/timeline',    icon: Clock,           label: 'Video-Timeline',   short: 'Videos'    },
  { href: '/checklist',   icon: CheckSquare,     label: 'Dreh-Checkliste',  short: 'Dreh'      },
]

export default function Nav() {
  const pathname = usePathname()

  return (
    <>
      {/* ── DESKTOP: Sidebar ───────────────────────────────── */}
      <nav className="sidebar-nav">
        <div className="p-5 border-b" style={{ borderColor: '#222' }}>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: '#E63946' }}>
              <Play size={14} fill="white" color="white" />
            </div>
            <div>
              <div className="font-semibold text-sm">Kelif HQ</div>
              <div className="text-xs" style={{ color: '#888' }}>Creator Dashboard</div>
            </div>
          </div>
        </div>

        <div className="flex-1 p-3 flex flex-col gap-0.5 overflow-y-auto">
          {nav.map(({ href, icon: Icon, label }) => {
            const active = pathname === href
            return (
              <Link key={href} href={href}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all"
                style={{
                  background: active ? '#1e1e1e' : 'transparent',
                  color: active ? 'white' : '#777',
                  borderLeft: active ? '2px solid #E63946' : '2px solid transparent',
                  marginLeft: 0,
                }}>
                <Icon size={16} strokeWidth={active ? 2.2 : 1.8} />
                {label}
              </Link>
            )
          })}
        </div>

        <div className="p-4 border-t" style={{ borderColor: '#222' }}>
          <div className="text-xs" style={{ color: '#555' }}>Elfi & Ken · Kelif</div>
          <div className="text-xs mt-0.5" style={{ color: '#3a3a3a' }}>Stuttgart / Ludwigsburg</div>
        </div>
      </nav>

      {/* ── MOBILE: Bottom Navigation ──────────────────────── */}
      <nav className="bottom-nav">
        {nav.map(({ href, icon: Icon, short }) => {
          const active = pathname === href
          return (
            <Link key={href} href={href} className="bottom-nav-item"
              style={{ color: active ? '#E63946' : '#555' }}>
              {active && (
                <span style={{
                  position: 'absolute', top: 6,
                  width: 4, height: 4,
                  borderRadius: '50%', background: '#E63946',
                }} />
              )}
              <Icon size={20} strokeWidth={active ? 2.2 : 1.8} />
              <span style={{ fontSize: 9, fontWeight: active ? 600 : 400, marginTop: 2 }}>
                {short}
              </span>
            </Link>
          )
        })}
      </nav>
    </>
  )
}
