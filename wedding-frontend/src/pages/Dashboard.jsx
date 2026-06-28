import { useEffect, useState } from 'react'
import { Heart, Users, CheckSquare, Calendar } from 'lucide-react'
import { weddingPlanApi, guestApi, taskApi } from '../api/index.js'

function daysUntil(dateStr) {
  if (!dateStr) return null
  const diff = new Date(dateStr) - new Date()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

export default function Dashboard({ onNavigate }) {
  const [plans, setPlans] = useState([])
  const [guests, setGuests] = useState([])
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([weddingPlanApi.getAll(), guestApi.getAll(), taskApi.getAll()])
      .then(([p, g, t]) => { setPlans(p); setGuests(g); setTasks(t) })
      .finally(() => setLoading(false))
  }, [])

  const nextWedding = plans
    .filter(p => p.weddingDate && daysUntil(p.weddingDate) >= 0)
    .sort((a, b) => new Date(a.weddingDate) - new Date(b.weddingDate))[0]

  const doneTasks   = tasks.filter(t => t.completed).length
  const attending   = guests.filter(g => g.attending).length

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 300 }}>
      <p style={{ color: 'var(--text-muted)', fontStyle: 'italic', fontFamily: 'var(--font-display)', fontSize: 22 }}>
        Einen Moment bitte…
      </p>
    </div>
  )

  return (
    <div>
      <div className="page-header">
        <div>
          <h2 className="page-title">Willkommen zurück 🌸</h2>
          <p className="page-subtitle">Hier ist eure Hochzeitsübersicht</p>
        </div>
      </div>

      {/* Countdown */}
      {nextWedding && (
        <div className="card" style={{
          background: 'linear-gradient(135deg, var(--rose-light), var(--lavender-light))',
          marginBottom: 28,
          display: 'flex',
          alignItems: 'center',
          gap: 28,
          flexWrap: 'wrap'
        }}>
          <div>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 4 }}>Nächste Hochzeit</p>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontStyle: 'italic' }}>
              {nextWedding.coupleName || `${nextWedding.partnerOneFirstName} & ${nextWedding.partnerTwoFirstName}`}
            </h3>
            <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginTop: 4 }}>
              📍 {nextWedding.location} · {new Date(nextWedding.weddingDate).toLocaleDateString('de-DE', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>
          <div style={{ marginLeft: 'auto', textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 72, lineHeight: 1, color: 'var(--rose-deep)' }}>
              {daysUntil(nextWedding.weddingDate)}
            </div>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>Tage</p>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid-3" style={{ marginBottom: 28 }}>
        <div className="stat-card">
          <Heart size={22} color="var(--rose-dark)" style={{ marginBottom: 10 }} />
          <div className="stat-value" style={{ color: 'var(--rose-dark)' }}>{plans.length}</div>
          <div className="stat-label">Hochzeit{plans.length !== 1 ? 'en' : ''} geplant</div>
        </div>
        <div className="stat-card">
          <Users size={22} color="var(--lavender-dark)" style={{ marginBottom: 10 }} />
          <div className="stat-value" style={{ color: 'var(--lavender-dark)' }}>{attending}</div>
          <div className="stat-label">Gäste zugesagt</div>
        </div>
        <div className="stat-card">
          <CheckSquare size={22} color="var(--success)" style={{ marginBottom: 10 }} />
          <div className="stat-value" style={{ color: 'var(--success)' }}>{doneTasks}/{tasks.length}</div>
          <div className="stat-label">Aufgaben erledigt</div>
        </div>
      </div>

      {/* Offene Tasks */}
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontStyle: 'italic' }}>
            Offene Aufgaben
          </h3>
          <button className="btn btn-secondary" style={{ fontSize: 13 }} onClick={() => onNavigate('tasks')}>
            Alle anzeigen
          </button>
        </div>

        {tasks.filter(t => !t.completed).length === 0 ? (
          <p style={{ color: 'var(--text-muted)', fontSize: 14, fontStyle: 'italic' }}>Alle Aufgaben erledigt 🎉</p>
        ) : (
          tasks.filter(t => !t.completed).slice(0, 5).map(task => (
            <div key={task.id} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '10px 0', borderBottom: '1px solid var(--creme-border)'
            }}>
              <div style={{
                width: 8, height: 8, borderRadius: '50%',
                background: 'var(--rose)', flexShrink: 0
              }} />
              <span style={{ fontSize: 14 }}>{task.title}</span>
              {task.notes && (
                <span style={{ fontSize: 12, color: 'var(--text-muted)', marginLeft: 'auto' }}>
                  {task.notes}
                </span>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
