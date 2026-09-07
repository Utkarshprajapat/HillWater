import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useData } from '../../context/DataContext'
import {
  Menu,
  Bell,
  Calendar,
  Clock,
  Radio,
  Play,
  Square,
  Users,
  Mountain,
  AlertTriangle,
  Flame,
  CheckCircle
} from 'lucide-react'

const Header = ({ onMenuClick, onAlertsClick }) => {
  const { 
    isConnected, 
    alerts, 
    isSurgeActive, 
    toggleTouristSurge, 
    isDemoRunning, 
    demoStep, 
    demoMessage, 
    runDemoScenario, 
    stopDemoScenario 
  } = useData()
  const [currentDateTime, setCurrentDateTime] = useState(new Date())

  const unreadAlerts = alerts.filter(a => !a.acknowledged).length

  // Update date/time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDateTime(new Date())
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const formatDate = (date) => {
    return date.toLocaleDateString('en-IN', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    })
  }

  return (
    <header className="bg-white border-b border-slate-200 min-h-16 flex-shrink-0 z-30 sticky top-0 shadow-sm">
      {/* Demo Scenario Progress Banner (When active) */}
      {isDemoRunning && (
        <div className="bg-amber-500 text-slate-900 px-4 py-1.5 text-xs font-bold flex items-center justify-between animate-pulse">
          <div className="flex items-center gap-2">
            <span className="bg-black text-white px-2 py-0.5 rounded text-[10px] uppercase font-mono">DEMO STEP {demoStep}/6</span>
            <span>{demoMessage}</span>
          </div>
          <button 
            onClick={stopDemoScenario}
            className="text-[11px] underline font-bold hover:text-black transition-colors"
          >
            Stop Demo
          </button>
        </div>
      )}

      <div className="flex items-center justify-between h-16 px-4 md:px-6">
        {/* Left Section - HillWater Branding */}
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="p-2 -ml-2 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors lg:hidden"
            aria-label="Toggle sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>

          <Link to="/overview" className="flex items-center gap-3 group">
            {/* Mountain & Water Icon Badge */}
            <div className="h-9 w-9 bg-sky-600 rounded-lg shadow-sm flex items-center justify-center text-white group-hover:bg-sky-700 transition-colors">
              <Mountain className="w-5 h-5" />
            </div>

            <div className="flex flex-col justify-center">
              <div className="flex items-center gap-2">
                <span className="text-base font-extrabold text-slate-900 tracking-tight leading-none">
                  HILL<span className="text-sky-600">WATER</span>
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-bold bg-sky-50 text-sky-700 rounded border border-sky-200">
                  Nainital Network (1,500m–2,260m)
                </span>
              </div>
              <p className="text-[10px] font-medium text-slate-500 uppercase tracking-wider hidden sm:block">
                Predictive Water-Service Reliability for Hill Towns
              </p>
            </div>
          </Link>
        </div>

        {/* Center / Right - Permanent Demo Label & Simulation Controls */}
        <div className="flex items-center gap-2 md:gap-4">
          
          {/* PERMANENT DEMO DATA LABEL */}
          <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 bg-amber-50 border border-amber-200 rounded-full text-amber-800 text-[11px] font-bold tracking-tight shadow-sm">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
            <span>SIMULATED DEMO DATA — NOT LIVE SENSOR DATA</span>
          </div>

          {/* Tourist Surge Trigger */}
          <button
            onClick={toggleTouristSurge}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm active:scale-95 border ${
              isSurgeActive 
                ? 'bg-rose-500 text-white border-rose-600 hover:bg-rose-600 ring-2 ring-rose-300' 
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200'
            }`}
            title="Simulate sudden tourist influx in Mallital, Mall Road, and Bara Bazaar"
          >
            <Users className={`w-3.5 h-3.5 ${isSurgeActive ? 'text-white' : 'text-rose-500'}`} />
            <span className="hidden sm:inline">{isSurgeActive ? 'Stop Surge' : 'Tourist Surge'}</span>
            <span className="sm:hidden">{isSurgeActive ? 'Surge ON' : 'Surge'}</span>
          </button>

          {/* Run Demo Scenario Button */}
          <button
            onClick={isDemoRunning ? stopDemoScenario : runDemoScenario}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm active:scale-95 ${
              isDemoRunning 
                ? 'bg-amber-600 text-white hover:bg-amber-700' 
                : 'bg-sky-600 text-white hover:bg-sky-700 hover:shadow-sky-200'
            }`}
          >
            {isDemoRunning ? (
              <>
                <Square className="w-3.5 h-3.5 fill-white" />
                <span>Stop Demo</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>Run Demo Scenario</span>
              </>
            )}
          </button>

          {/* Status Indicator */}
          <div className="hidden xl:flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
            <Radio className="w-3 h-3 text-emerald-600 animate-pulse" />
            <span className="text-xs font-semibold text-emerald-700 tracking-wide">
              SIMULATOR LIVE
            </span>
          </div>

          <div className="h-6 w-px bg-slate-200 hidden md:block"></div>

          {/* Date & Time */}
          <div className="hidden md:flex items-center gap-3 text-slate-600">
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-xs font-mono font-medium text-slate-800">
                {formatTime(currentDateTime)}
              </span>
            </div>
          </div>

          {/* Alerts Bell Button */}
          <button
            onClick={onAlertsClick}
            className="relative p-2 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-sky-600 transition-colors focus:ring-2 focus:ring-sky-500 focus:outline-none"
            aria-label="View alerts"
          >
            <Bell className="w-5 h-5" />
            {unreadAlerts > 0 && (
              <span className="absolute top-1 right-1 h-3 w-3 bg-rose-600 text-white rounded-full text-[9px] font-bold flex items-center justify-center">
                {unreadAlerts}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header
