import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2, Users, X, Check, Bed } from 'lucide-react'
import { guestApi, weddingPlanApi } from '../api/index.js'
import CreatableSelect from '../components/CreatableSelect.jsx'
import { DIETARY_OPTIONS, ALL_RELATIONSHIP_OPTIONS } from '../components/guestOptions.js'

const empty = {
  firstName: '', lastName: '', relationship: '',
  dietaryRestrictions: '', needsAccommodation: false, attending: true, weddingPlan: null
}

function GuestModal({ guest, plans, onClose, onSave }) {
  const [form, setForm] = useState(
    guest
      ? { ...guest, weddingPlan: guest.weddingPlan ? { id: guest.weddingPlan.id } : null }
      : { ...empty, weddingPlan: plans[0] ? { id: plans[0].id } : null }
  )

  const handle = e => {
    const { name, value, type, checked } = e.target
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }))
  }

  const submit = async () => {
    if (!form.firstName || !form.lastName) return
    await onSave(form)
    onClose()
  }

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ maxWidth: 560 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <h2 className="modal-title" style={{ margin: 0 }}>
            {guest ? 'Gast bearbeiten' : 'Neuen Gast hinzufügen'}
          </h2>
          <button className="btn btn-ghost" style={{ padding: 6 }} onClick={onClose}><X size={20} /></button>
        </div>

        {/* Name */}
        <div className="grid-2">
          <div className="form-group">
            <label className="form-label">Vorname *</label>
            <input
              className="form-input"
              name="firstName"
              value={form.firstName}
              onChange={handle}
              placeholder="Max"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Nachname *</label>
            <input
              className="form-input"
              name="lastName"
              value={form.lastName}
              onChange={handle}
              placeholder="Mustermann"
            />
          </div>
        </div>

        {/* Verhältnis */}
        <div className="form-group">
          <label className="form-label">
            Verhältnis
            <span style={{
              marginLeft: 8, fontSize: 11, fontWeight: 400,
              color: 'var(--text-muted)', fontStyle: 'italic'
            }}>
              (inkl. Hinweis Braut/Bräutigam-Seite)
            </span>
          </label>
          <CreatableSelect
            value={form.relationship}
            onChange={val => setForm(f => ({ ...f, relationship: val }))}
            options={ALL_RELATIONSHIP_OPTIONS}
            placeholder="z. B. Freundin der Braut"
          />
        </div>

        {/* Essenswünsche */}
        <div className="form-group">
          <label className="form-label">
            Essenswünsche / Unverträglichkeiten
          </label>
          <CreatableSelect
            value={form.dietaryRestrictions}
            onChange={val => setForm(f => ({ ...f, dietaryRestrictions: val }))}
            options={DIETARY_OPTIONS}
            placeholder="z. B. Vegetarisch"
          />
        </div>

        {/* Hochzeit */}
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

        {/* Checkboxen */}
        <div style={{ display: 'flex', gap: 28 }}>
          <label className="checkbox-row">
            <input type="checkbox" name="attending" checked={form.attending} onChange={handle} />
            <span style={{ fontSize: 14 }}>Zugesagt</span>
          </label>
          <label className="checkbox-row">
            <input type="checkbox" name="needsAccommodation" checked={form.needsAccommodation} onChange={handle} />
            <span style={{ fontSize: 14 }}>Unterkunft nötig</span>
          </label>
        </div>

        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose}>Abbrechen</button>
          <button
            className="btn btn-primary"
            onClick={submit}
            disabled={!form.firstName || !form.lastName}
            style={{ opacity: (!form.firstName || !form.lastName) ? 0.5 : 1 }}
          >
            <Users size={15} /> {guest ? 'Speichern' : 'Hinzufügen'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function Guests({ onToast }) {
  const [guests, setGuests]   = useState([])
  const [plans, setPlans]     = useState([])
  const [modal, setModal]     = useState(null)
  const [filter, setFilter]   = useState('all')

  const load = () => Promise.all([guestApi.getAll(), weddingPlanApi.getAll()])
    .then(([g, p]) => { setGuests(g); setPlans(p) })

  useEffect(() => { load() }, [])

  const save = async (form) => {
    if (modal?.id) {
      await guestApi.update(modal.id, form)
      onToast('Gast aktualisiert ✨')
    } else {
      await guestApi.create(form)
      onToast('Gast hinzugefügt 🌸')
    }
    load()
  }

  const remove = async (id) => {
    if (!confirm('Gast wirklich löschen?')) return
    await guestApi.delete(id)
    onToast('Gast entfernt')
    load()
  }

  const filtered = guests.filter(g => {
    if (filter === 'attending')     return g.attending
    if (filter === 'not')           return !g.attending
    if (filter === 'accommodation') return g.needsAccommodation
    return true
  })

  const attending = guests.filter(g => g.attending).length

  // Badge-Farbe je nach Gruppe
  const dietaryBadge = (val) => {
    if (!val || val === 'Keine') return null
    const vegan  = ['Vegan', 'Vegetarisch', 'Pescetarisch']
    const allerg = ['Nussallergie', 'Schalentierallergie']
    if (vegan.includes(val))  return { bg: 'var(--success-bg)',   color: '#3A7A48' }
    if (allerg.includes(val)) return { bg: '#FFF0F0',             color: '#A03030' }
    return { bg: 'var(--lavender-light)', color: 'var(--lavender-deep)' }
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h2 className="page-title">Gästeliste</h2>
          <p className="page-subtitle">{attending} von {guests.length} haben zugesagt</p>
        </div>
        <button className="btn btn-primary" onClick={() => setModal('new')}>
          <Plus size={16} /> Gast hinzufügen
        </button>
      </div>

      {/* Fortschrittsbalken */}
      {guests.length > 0 && (
        <div className="card" style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Zusagen</span>
            <span style={{ fontSize: 13, fontWeight: 500 }}>{Math.round((attending / guests.length) * 100)}%</span>
          </div>
          <div style={{ height: 8, borderRadius: 'var(--radius-full)', background: 'var(--creme-border)', overflow: 'hidden' }}>
            <div style={{
              height: '100%', borderRadius: 'var(--radius-full)',
              background: 'linear-gradient(90deg, var(--rose-dark), var(--lavender-dark))',
              width: `${(attending / guests.length) * 100}%`,
              transition: 'width 0.6s cubic-bezier(0.4,0,0.2,1)'
            }} />
          </div>
        </div>
      )}

      {/* Filter */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
        {[['all','Alle'],['attending','Zugesagt'],['not','Abgesagt'],['accommodation','Unterkunft']].map(([val, label]) => (
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

      {filtered.length === 0 ? (
        <div className="empty-state card">
          <Users size={40} color="var(--lavender)" style={{ margin: '0 auto' }} />
          <h3>Noch keine Gäste</h3>
          <p>Füge deine ersten Gäste hinzu.</p>
        </div>
      ) : (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          {filtered.map((guest, i) => {
            const dBadge = dietaryBadge(guest.dietaryRestrictions)
            return (
              <div
                key={guest.id}
                style={{
                  display: 'flex', alignItems: 'center', gap: 16,
                  padding: '14px 24px',
                  borderBottom: i < filtered.length - 1 ? '1px solid var(--creme-border)' : 'none',
                  transition: 'background var(--transition)',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--creme)'}
                onMouseLeave={e => e.currentTarget.style.background = ''}
              >
                {/* Avatar */}
                <div style={{
                  width: 42, height: 42, borderRadius: '50%', flexShrink: 0,
                  background: guest.attending ? 'var(--rose-light)' : 'var(--creme-dark)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'var(--font-display)', fontSize: 16,
                  color: 'var(--rose-deep)', fontWeight: 500,
                }}>
                  {guest.firstName[0]}{guest.lastName[0]}
                </div>

                {/* Name + Details */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 500, fontSize: 14 }}>
                    {guest.firstName} {guest.lastName}
                  </div>
                  {guest.relationship && (
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
                      {guest.relationship}
                    </div>
                  )}
                </div>

                {/* Badges */}
                <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'flex-end', flexShrink: 0 }}>
                  {dBadge && (
                    <span style={{
                      fontSize: 11, padding: '3px 9px', borderRadius: 'var(--radius-full)',
                      background: dBadge.bg, color: dBadge.color, fontWeight: 500,
                    }}>
                      {guest.dietaryRestrictions}
                    </span>
                  )}
                  {guest.needsAccommodation && (
                    <span className="badge badge-lavender"><Bed size={11} /> Unterkunft</span>
                  )}
                  {guest.attending
                    ? <span className="badge badge-success"><Check size={11} /> Zugesagt</span>
                    : <span className="badge badge-muted">Abgesagt</span>}
                </div>

                {/* Aktionen */}
                <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
                  <button
                    className="btn btn-ghost"
                    style={{ padding: '6px 8px' }}
                    onClick={() => setModal(guest)}
                    title="Bearbeiten"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    className="btn btn-ghost"
                    style={{ padding: '6px 8px', color: '#C0392B' }}
                    onClick={() => remove(guest.id)}
                    title="Löschen"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {modal && (
        <GuestModal
          guest={modal === 'new' ? null : modal}
          plans={plans}
          onClose={() => setModal(null)}
          onSave={save}
        />
      )}
    </div>
  )
}
