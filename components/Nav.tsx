'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Kanban, Calendar, Target, Clock, CheckSquare, BarChart2 } from 'lucide-react'

const nav = [
  { href: '/', icon: LayoutDashboard, label: 'Home' },
  { href: '/analytics', icon: BarChart2, label: 'Analytics' },
  { href: '/pipeline', icon: Kanban, label: 'Pipeline' },
  { href: '/calendar', icon: Calendar, label: 'Kalender' },
  { href: '/vision', icon: Target, label: 'Vision' },
  { href: '/timeline', icon: Clock, label: 'Videos' },
  { href: '/checklist', icon: CheckSquare, label: 'Dreh' },
]

export default function Nav() {
  const pathname = usePathname()
  return (
    <nav className="bottom-nav">
      {nav.map(({ href, icon: Icon, label }) => {
        const active = pathname === href
        return (
          <Link
            key={href}
            href={href}
            className="bottom-nav-item"
            style={{ color: active ? '#E63946' : '#555' }}
          >
            <Icon size={20} strokeWidth={active ? 2.2 : 1.8} />
            <span style={{
              fontSize: 9,
              fontWeight: active ? 600 : 400,
              marginTop: 2,
            }}>{label}</span>
            {active && (
              <span style={{
                position: 'absolute',
                top: 6,
                width: 4,
                height: 4,
                borderRadius: '50%',
                background: '#E63946',
              }} />
            )}
          </Link>
        )
      })}
    </nav>
  )
}
