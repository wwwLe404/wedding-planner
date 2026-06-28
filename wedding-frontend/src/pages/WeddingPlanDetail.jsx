import { useEffect, useState } from 'react'
import {
  ArrowLeft, MapPin, Calendar, Heart, Users, CheckSquare,
  Check, Bed, Square, Pencil, Trash2, Plus, X
} from 'lucide-react'
import { weddingPlanApi, guestApi, taskApi } from '../api/index.js'

function daysUntil(dateStr) {
  const d = Math.ceil((new Date(dateStr) - new Date()) / 86400000)
  return d >= 0 ? `Noch ${d} Tage` : `Vor ${Math.abs(d)} Tagen`
}

export default function WeddingPlanDetail({ planId, onBack, onToast }) {
  const [plan, setPlan]       = useState(null)
  const [guests, setGuests]   = useState([])
  const [tasks, setTasks]     = useState([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab]         = useState('guests') // 'guests' | 'tasks'

  const load = async () => {
    setLoading(true)
    try {
      const [p, g, t] = await Promise.all([
        weddingPlanApi.getById(planId),
        weddingPlanApi.getGuests(planId),
        weddingPlanApi.getTasks(planId),
      ])
      setPlan(p)
      setGuests(g)
      setTasks(t)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [planId])

  const toggleTask = async (task) => {
    await taskApi.update(task.id, {
      ...task,
      completed: !task.completed,
      weddingPlan: { id: planId }
    })
    load()
  }

  const deleteGuest = async (id) => {
    if (!confirm('Gast wirklich entfernen?')) return
    await guestApi.delete(id)
    onToast('Gast entfernt')
    load()
  }

  const deleteTask = async (id) => {
    await taskApi.delete(id)
    onToast('Aufgabe gelöscht')
    load()
  }

  if (loading) return (
    <div style={{ textAlign: 'center', padding: '80px 0' }}>
      <p style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontStyle: 'italic', color: 'var(--text-muted)' }}>
        Lädt…
      </p>
    </div>
  )

  if (!plan) return (
    <div style={{ textAlign: 'center', padding: '80px 0' }}>
      <p style={{ color: 'var(--text-muted)' }}>Hochzeit nicht gefunden.</p>
      <button className="btn btn-secondary" style={{ marginTop: 16 }} onClick={onBack}>
        <ArrowLeft size={15} /> Zurück
      </button>
    </div>
  )

  const attending    = guests.filter(g => g.attendingStatus === 'ATTENDING').length
  const doneTasks    = tasks.filter(t => t.completed).length
  const accommodation = guests.filter(g => g.needsAccommodation).length

  // Dietary-Zusammenfassung
  const dietaryMap = {}
  guests.forEach(g => {
    if (g.dietaryRestrictions && g.dietaryRestrictions !== 'Keine') {
      dietaryMap[g.dietaryRestrictions] = (dietaryMap[g.dietaryRestrictions] || 0) + 1
    }
  })

  return (
    <div>
      {/* Zurück-Button */}
      <button className="btn btn-ghost" style={{ marginBottom: 20, paddingLeft: 0 }} onClick={onBack}>
        <ArrowLeft size={16} /> Alle Hochzeiten
      </button>

      {/* Hero-Header */}
      <div style={{
        background: 'linear-gradient(135deg, var(--rose-light), var(--lavender-light))',
        borderRadius: 'var(--radius-xl)',
        padding: '36px 40px',
        marginBottom: 28,
        border: '1px solid var(--creme-border)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Dekorativer Hintergrund-Text */}
        <div style={{
          position: 'absolute', right: 32, top: '50%', transform: 'translateY(-50%)',
          fontFamily: 'var(--font-display)', fontSize: 120, opacity: 0.06,
          color: 'var(--rose-deep)', lineHeight: 1, userSelect: 'none',
          pointerEvents: 'none',
        }}>
          ♥
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 20 }}>
          <div style={{
            width: 64, height: 64, borderRadius: '50%',
            background: 'rgba(255,255,255,0.6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <Heart size={28} color="var(--rose-dark)" />
          </div>

          <div>
            <h2 style={{
              fontFamily: 'var(--font-display)', fontSize: 38,
              fontStyle: 'italic', color: 'var(--text-primary)', marginBottom: 6,
            }}>
              {plan.coupleName || `${plan.partnerOneFirstName} & ${plan.partnerTwoFirstName}`}
            </h2>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginTop: 8 }}>
              {plan.location && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, color: 'var(--text-secondary)' }}>
                  <MapPin size={15} color="var(--rose-dark)" />
                  {plan.location}
                </div>
              )}
              {plan.weddingDate && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, color: 'var(--text-secondary)' }}>
                  <Calendar size={15} color="var(--lavender-dark)" />
                  {new Date(plan.weddingDate).toLocaleDateString('de-DE', { day: 'numeric', month: 'long', year: 'numeric' })}
                  <span className="badge badge-rose">{daysUntil(plan.weddingDate)}</span>
                </div>
              )}
            </div>

            <div style={{ marginTop: 10, fontSize: 13, color: 'var(--text-muted)' }}>
              {plan.partnerOneFirstName} & {plan.partnerTwoFirstName}
            </div>
          </div>
        </div>
      </div>

      {/* Stat-Kacheln */}
      <div className="grid-3" style={{ marginBottom: 28 }}>
        <div className="stat-card">
          <Users size={20} color="var(--rose-dark)" style={{ marginBottom: 8 }} />
          <div className="stat-value" style={{ color: 'var(--rose-dark)', fontSize: 36 }}>{attending}</div>
          <div className="stat-label">von {guests.length} zugesagt</div>
        </div>
        <div className="stat-card">
          <CheckSquare size={20} color="var(--lavender-dark)" style={{ marginBottom: 8 }} />
          <div className="stat-value" style={{ color: 'var(--lavender-dark)', fontSize: 36 }}>{doneTasks}/{tasks.length}</div>
          <div className="stat-label">Aufgaben erledigt</div>
        </div>
        <div className="stat-card">
          <Bed size={20} color="var(--text-muted)" style={{ marginBottom: 8 }} />
          <div className="stat-value" style={{ fontSize: 36 }}>{accommodation}</div>
          <div className="stat-label">brauchen Unterkunft</div>
        </div>
      </div>

      {/* Besondere Essenswünsche Zusammenfassung */}
      {Object.keys(dietaryMap).length > 0 && (
        <div className="card" style={{ marginBottom: 28 }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 18, marginBottom: 14 }}>
            Essenswünsche-Übersicht
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {Object.entries(dietaryMap).map(([diet, count]) => (
              <span key={diet} className="badge badge-lavender" style={{ fontSize: 13, padding: '5px 12px' }}>
                {diet} <strong style={{ marginLeft: 4 }}>×{count}</strong>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Tab-Switcher: Gäste / Aufgaben */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 20, background: 'var(--creme-dark)', borderRadius: 'var(--radius-full)', padding: 4, width: 'fit-content' }}>
        {[['guests', `Gäste (${guests.length})`], ['tasks', `Aufgaben (${tasks.length})`]].map(([id, label]) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            style={{
              padding: '8px 20px',
              borderRadius: 'var(--radius-full)',
              border: 'none',
              fontFamily: 'var(--font-body)',
              fontSize: 13,
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all var(--transition)',
              background: tab === id ? 'var(--white)' : 'transparent',
              color: tab === id ? 'var(--rose-deep)' : 'var(--text-muted)',
              boxShadow: tab === id ? 'var(--shadow-sm)' : 'none',
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Gäste-Tab */}
      {tab === 'guests' && (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          {guests.length === 0 ? (
            <div className="empty-state" style={{ padding: '40px 24px' }}>
              <Users size={32} color="var(--lavender)" style={{ margin: '0 auto' }} />
              <h3 style={{ fontSize: 18 }}>Noch keine Gäste</h3>
              <p>Füge Gäste über die Gästeliste hinzu und weise sie dieser Hochzeit zu.</p>
            </div>
          ) : (
            guests.map((guest, i) => (
              <div
                key={guest.id}
                style={{
                  display: 'flex', alignItems: 'center', gap: 14,
                  padding: '14px 24px',
                  borderBottom: i < guests.length - 1 ? '1px solid var(--creme-border)' : 'none',
                  transition: 'background var(--transition)',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--creme)'}
                onMouseLeave={e => e.currentTarget.style.background = ''}
              >
                <div style={{
                  width: 38, height: 38, borderRadius: '50%', flexShrink: 0,
                  background: guest.attendingStatus === 'ATTENDING' ? 'var(--rose-light)' : 'var(--creme-dark)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'var(--font-display)', fontSize: 14, color: 'var(--rose-deep)', fontWeight: 500,
                }}>
                  {guest.firstName[0]}{guest.lastName[0]}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 500, fontSize: 14 }}>
                    {guest.firstName} {guest.lastName}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 1 }}>
                    {[guest.relationship, guest.dietaryRestrictions && guest.dietaryRestrictions !== 'Keine' ? guest.dietaryRestrictions : null].filter(Boolean).join(' · ')}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 6, flexShrink: 0, alignItems: 'center' }}>
                  {guest.needsAccommodation && <span className="badge badge-lavender"><Bed size={10} /> Unterkunft</span>}
                  {guest.attendingStatus === 'ATTENDING' && (
                      <span className="badge badge-success"><Check size={10} /> Zugesagt</span>
                  )}
                  {guest.attendingStatus === 'NOT_ATTENDING' && (
                      <span className="badge badge-muted">Abgesagt</span>
                  )}
                  {guest.attendingStatus === 'PENDING' && (
                      <span className="badge badge-rose">Noch offen</span>
                  )}
                  <button
                    className="btn btn-ghost"
                    style={{ padding: '5px 7px', color: '#C0392B' }}
                    onClick={() => deleteGuest(guest.id)}
                    title="Entfernen"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Aufgaben-Tab */}
      {tab === 'tasks' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {tasks.length === 0 ? (
            <div className="empty-state card">
              <CheckSquare size={32} color="var(--lavender)" style={{ margin: '0 auto' }} />
              <h3 style={{ fontSize: 18 }}>Keine Aufgaben</h3>
              <p>Weise Aufgaben dieser Hochzeit über die Aufgaben-Seite zu.</p>
            </div>
          ) : (
            tasks.map(task => (
              <div
                key={task.id}
                className="card"
                style={{
                  display: 'flex', alignItems: 'flex-start', gap: 12,
                  padding: '14px 20px', opacity: task.completed ? 0.65 : 1,
                  transition: 'all var(--transition)',
                }}
              >
                <button
                  className="btn btn-ghost"
                  style={{ padding: 0, marginTop: 1, color: task.completed ? 'var(--success)' : 'var(--text-muted)' }}
                  onClick={() => toggleTask(task)}
                >
                  {task.completed ? <CheckSquare size={20} /> : <Square size={20} />}
                </button>
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontWeight: 500, fontSize: 14,
                    textDecoration: task.completed ? 'line-through' : 'none',
                    color: task.completed ? 'var(--text-muted)' : 'var(--text-primary)',
                  }}>
                    {task.title}
                  </div>
                  {task.notes && (
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 3 }}>{task.notes}</div>
                  )}
                </div>
                <button
                  className="btn btn-ghost"
                  style={{ padding: '5px 7px', color: '#C0392B', flexShrink: 0 }}
                  onClick={() => deleteTask(task.id)}
                >
                  <Trash2 size={13} />
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}
