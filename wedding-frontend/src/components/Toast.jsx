import { useEffect } from 'react'
import { CheckCircle, AlertCircle, X } from 'lucide-react'

export default function Toast({ message, type = 'success', onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3200)
    return () => clearTimeout(t)
  }, [onClose])

  return (
    <div className="toast">
      {type === 'success'
        ? <CheckCircle size={18} color="var(--success)" />
        : <AlertCircle size={18} color="#C0392B" />}
      <span style={{ color: 'var(--text-primary)', fontSize: 14 }}>{message}</span>
      <button className="btn btn-ghost" style={{ padding: '2px 6px', marginLeft: 'auto' }} onClick={onClose}>
        <X size={14} />
      </button>
    </div>
  )
}
