import { useState, useCallback } from 'react'
import Sidebar from './components/Sidebar.jsx'
import Toast from './components/Toast.jsx'
import Dashboard from './pages/Dashboard.jsx'
import WeddingPlans from './pages/WeddingPlans.jsx'
import WeddingPlanDetail from './pages/WeddingPlanDetail.jsx'
import Guests from './pages/Guests.jsx'
import Tasks from './pages/Tasks.jsx'
import Weather from './pages/Weather.jsx'

export default function App() {
  const [page, setPage]           = useState('dashboard')
  const [detailPlanId, setDetailPlanId] = useState(null)
  const [toast, setToast]         = useState(null)

  const showToast = useCallback((msg, type = 'success') => {
    setToast({ msg, type, key: Date.now() })
  }, [])

  const navigate = (p) => {
    setPage(p)
    setDetailPlanId(null)
  }

  const openDetail = (id) => {
    setDetailPlanId(id)
    setPage('plan-detail')
  }

  const renderPage = () => {
    if (page === 'plan-detail' && detailPlanId) {
      return (
        <WeddingPlanDetail
          planId={detailPlanId}
          onBack={() => navigate('plans')}
          onToast={showToast}
        />
      )
    }
    switch (page) {
      case 'plans':     return <WeddingPlans onToast={showToast} onDetail={openDetail} />
      case 'guests':    return <Guests onToast={showToast} />
      case 'tasks':     return <Tasks onToast={showToast} />
      case 'weather':   return <Weather onToast={showToast} />
      default:          return <Dashboard onNavigate={navigate} />
    }
  }

  return (
    <div className="page-wrapper">
      <Sidebar active={page === 'plan-detail' ? 'plans' : page} onNavigate={navigate} />
      <main className="main-content">
        {renderPage()}
      </main>
      {toast && (
        <Toast
          key={toast.key}
          message={toast.msg}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  )
}
