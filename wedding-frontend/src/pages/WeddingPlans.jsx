import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2, Heart, MapPin, Calendar, X, ExternalLink } from 'lucide-react'
import { weddingPlanApi } from '../api/index.js'

const empty = { partnerOneFirstName: '', partnerTwoFirstName: '', coupleName: '', location: '', weddingDate: '' }

function PlanModal({ plan, onClose, onSave }) {
  const [form, setForm] = useState(plan || empty)

  const handle = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const submit = async () => {
    if (!form.partnerOneFirstName || !form.partnerTwoFirstName) return
    await onSave(form)
    onClose()
  }

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <h2 className="modal-title" style={{ margin: 0 }}>
            {plan ? 'Hochzeit bearbeiten' : 'Neue Hochzeit anlegen'}
          </h2>
          <button className="btn btn-ghost" style={{ padding: 6 }} onClick={onClose}><X size={20} /></button>
        </div>

        <div className="grid-2">
          <div className="form-group">
            <label className="form-label">Partner 1</label>
            <input className="form-input" name="partnerOneFirstName" value={form.partnerOneFirstName} onChange={handle} placeholder="z. B. Sophie" />
          </div>
          <div className="form-group">
            <label className="form-label">Partner 2</label>
            <input className="form-input" name="partnerTwoFirstName" value={form.partnerTwoFirstName} onChange={handle} placeholder="z. B. Lena" />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Spitzname / Paarname</label>
          <input className="form-input" name="coupleName" value={form.coupleName} onChange={handle} placeholder="z. B. Sophie & Lena" />
        </div>

        <div className="form-group">
          <label className="form-label">Ort</label>
          <input className="form-input" name="location" value={form.location} onChange={handle} placeholder="z. B. München" />
        </div>

        <div className="form-group">
          <label className="form-label">Hochzeitsdatum</label>
          <input className="form-input" type="date" name="weddingDate" value={form.weddingDate} onChange={handle} />
        </div>

        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose}>Abbrechen</button>
          <button className="btn btn-primary" onClick={submit}>
            <Heart size={15} /> {plan ? 'Speichern' : 'Anlegen'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function WeddingPlans({ onToast, onDetail }) {
  const [plans, setPlans] = useState([])
  const [modal, setModal] = useState(null) // null | 'new' | plan-object

  const load = () => weddingPlanApi.getAll().then(setPlans)
  useEffect(() => { load() }, [])

  const save = async (form) => {
    if (modal?.id) {
      await weddingPlanApi.update(modal.id, form)
      onToast('Hochzeit aktualisiert ✨')
    } else {
      await weddingPlanApi.create(form)
      onToast('Neue Hochzeit angelegt 🌸')
    }
    load()
  }

  const remove = async (id) => {
    if (!confirm('Hochzeitsplan wirklich löschen?')) return
    await weddingPlanApi.delete(id)
    onToast('Gelöscht')
    load()
  }

  const daysLeft = (date) => {
    const d = Math.ceil((new Date(date) - new Date()) / 86400000)
    return d >= 0 ? `Noch ${d} Tage` : `Vor ${Math.abs(d)} Tagen`
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h2 className="page-title">Hochzeiten</h2>
          <p className="page-subtitle">{plans.length} Hochzeit{plans.length !== 1 ? 'en' : ''} geplant</p>
        </div>
        <button className="btn btn-primary" onClick={() => setModal('new')}>
          <Plus size={16} /> Neue Hochzeit
        </button>
      </div>

      {plans.length === 0 ? (
        <div className="empty-state card">
          <Heart size={40} color="var(--rose)" style={{ margin: '0 auto' }} />
          <h3>Noch keine Hochzeit geplant</h3>
          <p>Lege deine erste Hochzeit an und fang mit der Planung an.</p>
          <button className="btn btn-primary" style={{ margin: '20px auto 0' }} onClick={() => setModal('new')}>
            <Plus size={16} /> Jetzt anlegen
          </button>
        </div>
      ) : (
        <div className="grid-2">
          {plans.map(plan => (
            <div key={plan.id} className="card card-clickable" style={{ position: 'relative' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 16 }}>
                <div style={{
                  width: 48, height: 48, borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--rose-light), var(--lavender-light))',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                }}>
                  <Heart size={20} color="var(--rose-dark)" />
                </div>
                <div>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontStyle: 'italic' }}>
                    {plan.coupleName || `${plan.partnerOneFirstName} & ${plan.partnerTwoFirstName}`}
                  </h3>
                  <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                    {plan.partnerOneFirstName} & {plan.partnerTwoFirstName}
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {plan.location && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--text-secondary)' }}>
                    <MapPin size={14} color="var(--rose-dark)" />
                    {plan.location}
                  </div>
                )}
                {plan.weddingDate && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--text-secondary)' }}>
                    <Calendar size={14} color="var(--lavender-dark)" />
                    {new Date(plan.weddingDate).toLocaleDateString('de-DE', { day: 'numeric', month: 'long', year: 'numeric' })}
                    <span className="badge badge-rose" style={{ marginLeft: 4 }}>
                      {daysLeft(plan.weddingDate)}
                    </span>
                  </div>
                )}
              </div>

              <hr className="divider" />
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn btn-primary" style={{ fontSize: 12 }} onClick={() => onDetail(plan.id)}>
                  <ExternalLink size={13} /> Details
                </button>
                <button className="btn btn-secondary" style={{ fontSize: 12 }} onClick={() => setModal(plan)}>
                  <Pencil size={13} /> Bearbeiten
                </button>
                <button className="btn btn-danger" style={{ fontSize: 12 }} onClick={() => remove(plan.id)}>
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modal && (
        <PlanModal
          plan={modal === 'new' ? null : modal}
          onClose={() => setModal(null)}
          onSave={save}
        />
      )}
    </div>
  )
}
