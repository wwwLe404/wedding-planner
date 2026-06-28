import { Heart, Users, CheckSquare, LayoutDashboard, CloudSun } from 'lucide-react'

const links = [
  { id: 'dashboard', label: 'Übersicht',    icon: LayoutDashboard },
  { id: 'plans',     label: 'Hochzeiten',   icon: Heart },
  { id: 'guests',    label: 'Gästeliste',   icon: Users },
  { id: 'tasks',     label: 'Aufgaben',     icon: CheckSquare },
  { id: 'weather',   label: 'Wetter',       icon: CloudSun },
]

export default function Sidebar({ active, onNavigate }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <h1>Wedding Planner</h1>
        <p>Euer großer Tag ✨</p>
      </div>

      <nav className="sidebar-nav">
        <p className="nav-section-label">Navigation</p>
        {links.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            className={`nav-link ${active === id ? 'active' : ''}`}
            onClick={() => onNavigate(id)}
          >
            <Icon />
            {label}
          </button>
        ))}
      </nav>

      <div style={{ padding: '16px 24px', borderTop: '1px solid var(--creme-border)' }}>
        <p style={{ fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.5 }}>
          Für das schönste Abenteuer<br />eures Lebens 🌸
        </p>
      </div>
    </aside>
  )
}
