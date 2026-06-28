import { useEffect, useState } from 'react'
import { Plus, Trash2, X, CheckSquare, Square } from 'lucide-react'
import { taskApi, weddingPlanApi } from '../api/index.js'

function TaskModal({ task, plans, onClose, onSave }) {
  const [form, setForm] = useState(
    task
      ? { ...task, weddingPlan: task.weddingPlan ? { id: task.weddingPlan.id } : null }
      : { title: '', notes: '', completed: false, weddingPlan: plans[0] ? { id: plans[0].id } : null }
  )

  const handle = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const submit = async () => {
    if (!form.title.trim()) return
    await onSave(form)
    onClose()
  }

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <h2 className="modal-title" style={{ margin: 0 }}>
            {task ? 'Aufgabe bearbeiten' : 'Neue Aufgabe'}
          </h2>
          <button className="btn btn-ghost" style={{ padding: 6 }} onClick={onClose}><X size={20} /></button>
        </div>

        <div className="form-group">
          <label className="form-label">Titel</label>
          <input className="form-input" name="title" value={form.title} onChange={handle} placeholder="z. B. Blumendeko bestellen" autoFocus />
        </div>

        <div className="form-group">
          <label className="form-label">Notizen</label>
          <textarea className="form-textarea" name="notes" value={form.notes || ''} onChange={handle} placeholder="Weitere Details…" />
        </div>

        <div className="form-group">
          <label className="form-label">Hochzeit</label>
          <select
            className="form-select"
            value={form.weddingPlan?.id ?? ''}
            onChange={e => setForm(f => ({ ...f, weddingPlan: e.target.value ? { id: Number(e.target.value) } : null }))}
          >
            <option value="">— keine Zuordnung —</option>
            {plans.map(p => (
              <option key={p.id} value={p.id}>
                {p.coupleName || `${p.partnerOneFirstName} & ${p.partnerTwoFirstName}`}
              </option>
            ))}
          </select>
        </div>

        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose}>Abbrechen</button>
          <button className="btn btn-primary" onClick={submit}>
            <CheckSquare size={15} /> {task ? 'Speichern' : 'Erstellen'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function Tasks({ onToast }) {
  const [tasks, setTasks] = useState([])
  const [plans, setPlans] = useState([])
  const [modal, setModal] = useState(null)
  const [filter, setFilter] = useState('all')
  const [planFilter, setPlanFilter] = useState('all')

  const load = () => Promise.all([taskApi.getAll(), weddingPlanApi.getAll()])
    .then(([t, p]) => { setTasks(t); setPlans(p) })

  useEffect(() => { load() }, [])

  const save = async (form) => {
    if (modal?.id) {
      await taskApi.update(modal.id, form)
      onToast('Aufgabe aktualisiert ✨')
    } else {
      await taskApi.create(form)
      onToast('Aufgabe erstellt 🌸')
    }
    load()
  }

  const toggle = async (task) => {
    await taskApi.update(task.id, { ...task, completed: !task.completed, weddingPlan: task.weddingPlan ? { id: task.weddingPlan.id } : null })
    load()
  }

  const remove = async (id) => {
    await taskApi.delete(id)
    onToast('Aufgabe gelöscht')
    load()
  }

  const done   = tasks.filter(t => t.completed).length
  const open   = tasks.length - done
  const filtered = tasks.filter(t => {
    if (filter === 'open') return !t.completed
    if (filter === 'done') return t.completed
    return true
  }).filter(t => {
    if (planFilter === 'all') return true
    return t.weddingPlan?.id === Number(planFilter)
  })

  return (
    <div>
      <div className="page-header">
        <div>
          <h2 className="page-title">Aufgaben</h2>
          <p className="page-subtitle">{open} offen · {done} erledigt</p>
        </div>
        <button className="btn btn-primary" onClick={() => setModal('new')}>
          <Plus size={16} /> Neue Aufgabe
        </button>
      </div>

      {/* Progress */}
      {tasks.length > 0 && (
        <div className="card" style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Fortschritt</span>
            <span style={{ fontSize: 13, fontWeight: 500 }}>{done}/{tasks.length}</span>
          </div>
          <div style={{ height: 8, borderRadius: 'var(--radius-full)', background: 'var(--creme-border)', overflow: 'hidden' }}>
            <div style={{
              height: '100%', borderRadius: 'var(--radius-full)',
              background: 'linear-gradient(90deg, var(--success), var(--lavender-dark))',
              width: `${tasks.length ? (done / tasks.length) * 100 : 0}%`,
              transition: 'width 0.5s cubic-bezier(0.4,0,0.2,1)'
            }} />
          </div>
        </div>
      )}

      {/* Filter */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        {[['all','Alle'],['open','Offen'],['done','Erledigt']].map(([val, label]) => (
          <button
            key={val}
            className={`btn ${filter === val ? 'btn-primary' : 'btn-secondary'}`}
            style={{ fontSize: 13 }}
            onClick={() => setFilter(val)}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Hochzeits-Filter */}
      {plans.length > 0 && (
          <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
            <button
                className={`btn ${planFilter === 'all' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ fontSize: 13 }}
                onClick={() => setPlanFilter('all')}
            >
              Alle Hochzeiten
            </button>
            {plans.map(p => (
                <button
                    key={p.id}
                    className={`btn ${planFilter === String(p.id) ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ fontSize: 13 }}
                    onClick={() => setPlanFilter(String(p.id))}
                >
                  {p.coupleName || `${p.partnerOneFirstName} & ${p.partnerTwoFirstName}`}
                </button>
            ))}
          </div>
      )}


      {filtered.length === 0 ? (
        <div className="empty-state card">
          <CheckSquare size={40} color="var(--lavender)" style={{ margin: '0 auto' }} />
          <h3>Keine Aufgaben</h3>
          <p>Alles erledigt — oder noch nichts angelegt.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {filtered.map(task => (
            <div key={task.id} className="card" style={{
              display: 'flex', alignItems: 'flex-start', gap: 14, padding: '16px 20px',
              opacity: task.completed ? 0.7 : 1,
              transition: 'all var(--transition)'
            }}>
              <button
                className="btn btn-ghost"
                style={{ padding: 0, marginTop: 2, color: task.completed ? 'var(--success)' : 'var(--text-muted)' }}
                onClick={() => toggle(task)}
                title={task.completed ? 'Als offen markieren' : 'Als erledigt markieren'}
              >
                {task.completed ? <CheckSquare size={22} /> : <Square size={22} />}
              </button>

              <div style={{ flex: 1 }}>
                <div style={{
                  fontWeight: 500, fontSize: 14,
                  textDecoration: task.completed ? 'line-through' : 'none',
                  color: task.completed ? 'var(--text-muted)' : 'var(--text-primary)'
                }}>
                  {task.title}
                </div>
                {task.notes && (
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>{task.notes}</div>
                )}
              </div>

              {task.weddingPlan && (
                <span className="badge badge-lavender" style={{ flexShrink: 0 }}>
                  {plans.find(p => p.id === task.weddingPlan.id)?.coupleName || '–'}
                </span>
              )}

              <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
                <button className="btn btn-ghost" style={{ padding: '5px 8px', color: '#C0392B' }} onClick={() => remove(task.id)}>
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modal && (
        <TaskModal
          task={modal === 'new' ? null : modal}
          plans={plans}
          onClose={() => setModal(null)}
          onSave={save}
        />
      )}
    </div>
  )
}
