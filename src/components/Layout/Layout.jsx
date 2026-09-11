import { useState, useRef, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import Header from './Header'
import Sidebar from './Sidebar'
import AlertsPanel from './AlertsPanel'

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [alertsOpen, setAlertsOpen] = useState(false)

  const mainRef = useRef(null)
  const location = useLocation()

  // Scroll to top whenever route changes
  useEffect(() => {
    if (mainRef.current) {
      mainRef.current.scrollTo(0, 0)
    }
  }, [location.pathname])

  return (
    <div className="flex h-screen overflow-hidden bg-municipal-gray-50">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header
          onMenuClick={() => setSidebarOpen(!sidebarOpen)}
          onAlertsClick={() => setAlertsOpen(!alertsOpen)}
        />

        {/* SIMULATED DATA BANNER */}
        <div className="bg-amber-100 border-b border-amber-200 text-amber-900 text-[11px] font-bold py-1.5 px-4 text-center uppercase tracking-widest z-10 shadow-sm flex items-center justify-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></div>
          SIMULATED DEMO DATA — NOT LIVE SENSOR DATA
        </div>

        {/* Page Content */}
        <main
          ref={mainRef}
          className="flex-1 overflow-y-auto scrollbar-thin bg-white"
        >
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>

      {/* Alerts Panel */}
      <AlertsPanel isOpen={alertsOpen} onClose={() => setAlertsOpen(false)} />
    </div>
  )
}

export default Layout
