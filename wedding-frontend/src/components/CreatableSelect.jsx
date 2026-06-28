import { useState, useRef, useEffect } from 'react'
import { ChevronDown, Plus, X, Check } from 'lucide-react'

/**
 * CreatableSelect – Dropdown mit vordefinierten Optionen + eigene anlegen
 *
 * Props:
 *  value        string     – aktuell gewählter Wert
 *  onChange     fn(value)  – Callback wenn sich Wert ändert
 *  options      Array<{ label, value, group? }> – vordefinierte Optionen
 *  placeholder  string
 *  allowCustom  bool       – ob eigene Einträge erlaubt sind (default: true)
 */
export default function CreatableSelect({
  value,
  onChange,
  options = [],
  placeholder = 'Auswählen…',
  allowCustom = true,
}) {
  const [open, setOpen]         = useState(false)
  const [search, setSearch]     = useState('')
  const [custom, setCustom]     = useState([])
  const ref                     = useRef(null)

  // Außerhalb klicken → schließen
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const allOptions = [...options, ...custom.map(c => ({ label: c, value: c, group: 'Eigene' }))]

  const filtered = search.trim()
    ? allOptions.filter(o => o.label.toLowerCase().includes(search.toLowerCase()))
    : allOptions

  // Gruppen
  const groups = {}
  filtered.forEach(o => {
    const g = o.group || 'Allgemein'
    if (!groups[g]) groups[g] = []
    groups[g].push(o)
  })

  const selected = allOptions.find(o => o.value === value)

  const select = (val) => {
    onChange(val)
    setOpen(false)
    setSearch('')
  }

  const clear = (e) => {
    e.stopPropagation()
    onChange('')
  }

  const addCustom = () => {
    const trimmed = search.trim()
    if (!trimmed) return
    if (!allOptions.find(o => o.value === trimmed)) {
      setCustom(prev => [...prev, trimmed])
    }
    select(trimmed)
  }

  const canAdd = allowCustom && search.trim() && !allOptions.find(o => o.value === search.trim())

  return (
    <div ref={ref} style={{ position: 'relative', width: '100%' }}>
      {/* Trigger */}
      <button
        type="button"
        onClick={() => { setOpen(o => !o); setSearch('') }}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 8,
          padding: '11px 14px',
          border: `1.5px solid ${open ? 'var(--rose)' : 'var(--creme-border)'}`,
          borderRadius: 'var(--radius-md)',
          background: 'var(--white)',
          cursor: 'pointer',
          fontFamily: 'var(--font-body)',
          fontSize: 14,
          color: selected ? 'var(--text-primary)' : 'var(--text-muted)',
          textAlign: 'left',
          boxShadow: open ? '0 0 0 3px rgba(232,160,180,0.18)' : 'none',
          transition: 'border-color 0.22s, box-shadow 0.22s',
        }}
      >
        <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {selected ? selected.label : placeholder}
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
          {value && (
            <span
              onClick={clear}
              style={{ display: 'flex', color: 'var(--text-muted)', padding: 2, borderRadius: 4, cursor: 'pointer' }}
              title="Leeren"
            >
              <X size={14} />
            </span>
          )}
          <span style={{
            color: 'var(--text-muted)',
            transform: open ? 'rotate(180deg)' : 'none',
            transition: 'transform 0.2s',
            display: 'flex'
          }}>
            <ChevronDown size={16} />
          </span>
        </span>
      </button>

      {/* Dropdown */}
      {open && (
        <div style={{
          position: 'absolute',
          top: 'calc(100% + 6px)',
          left: 0, right: 0,
          background: 'var(--white)',
          border: '1.5px solid var(--creme-border)',
          borderRadius: 'var(--radius-md)',
          boxShadow: '0 8px 32px rgba(169,100,130,0.14)',
          zIndex: 50,
          overflow: 'hidden',
          animation: 'slideUp 0.15s ease',
        }}>
          {/* Suchfeld */}
          <div style={{ padding: '10px 12px', borderBottom: '1px solid var(--creme-border)' }}>
            <input
              autoFocus
              value={search}
              onChange={e => setSearch(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') canAdd ? addCustom() : filtered[0] && select(filtered[0].value) }}
              placeholder="Suchen oder eigenen eingeben…"
              style={{
                width: '100%', border: 'none', outline: 'none',
                fontFamily: 'var(--font-body)', fontSize: 13,
                color: 'var(--text-primary)', background: 'transparent',
              }}
            />
          </div>

          {/* Optionen */}
          <div style={{ maxHeight: 240, overflowY: 'auto' }}>
            {Object.entries(groups).length === 0 && !canAdd && (
              <div style={{ padding: '12px 16px', fontSize: 13, color: 'var(--text-muted)', textAlign: 'center' }}>
                Keine Ergebnisse
              </div>
            )}

            {Object.entries(groups).map(([group, items]) => (
              <div key={group}>
                {Object.keys(groups).length > 1 && (
                  <div style={{
                    padding: '8px 14px 4px',
                    fontSize: 10, fontWeight: 600, letterSpacing: '0.08em',
                    textTransform: 'uppercase', color: 'var(--text-muted)',
                  }}>
                    {group}
                  </div>
                )}
                {items.map(opt => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => select(opt.value)}
                    style={{
                      width: '100%', textAlign: 'left', padding: '10px 16px',
                      border: 'none', background: opt.value === value ? 'var(--rose-light)' : 'transparent',
                      cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: 14,
                      color: opt.value === value ? 'var(--rose-deep)' : 'var(--text-primary)',
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      transition: 'background 0.15s',
                    }}
                    onMouseEnter={e => { if (opt.value !== value) e.currentTarget.style.background = 'var(--creme)' }}
                    onMouseLeave={e => { if (opt.value !== value) e.currentTarget.style.background = 'transparent' }}
                  >
                    {opt.label}
                    {opt.value === value && <Check size={14} color="var(--rose-deep)" />}
                  </button>
                ))}
              </div>
            ))}

            {/* Eigene anlegen */}
            {canAdd && (
              <button
                type="button"
                onClick={addCustom}
                style={{
                  width: '100%', textAlign: 'left', padding: '10px 16px',
                  border: 'none', borderTop: '1px solid var(--creme-border)',
                  background: 'var(--lavender-light)', cursor: 'pointer',
                  fontFamily: 'var(--font-body)', fontSize: 14,
                  color: 'var(--lavender-deep)',
                  display: 'flex', alignItems: 'center', gap: 8,
                  transition: 'background 0.15s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--lavender-light)'}
                onMouseLeave={e => e.currentTarget.style.background = 'var(--lavender-light)'}
              >
                <Plus size={15} />
                <span>„{search.trim()}" anlegen</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
