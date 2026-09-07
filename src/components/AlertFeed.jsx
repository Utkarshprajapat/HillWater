import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useData } from '../context/DataContext'
import {
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
  Clock,
  ArrowRight,
  Mountain,
  Gauge,
  Zap,
  HelpCircle,
  Bell,
  Send,
  Play
} from 'lucide-react'

const AlertFeed = () => {
  const { alerts, acknowledgeAlert, applyZoneIntervention, addLog } = useData()
  const navigate = useNavigate()
  const [selectedAlertId, setSelectedAlertId] = useState(null)
  const [notifiedMap, setNotifiedMap] = useState({})

  const activeAlerts = alerts.filter(a => !a.acknowledged)
  const resolvedAlerts = alerts.filter(a => a.acknowledged).slice(0, 10)

  const handleNotifyFieldTeam = (alert) => {
    setNotifiedMap(prev => ({ ...prev, [alert.id]: true }))
    addLog(`Field Maintenance Team dispatched for ${alert.zoneName}: ${alert.title}`, alert.zoneName, {
      type: 'Field Dispatch',
      user: 'Operations Officer'
    })
    setTimeout(() => {
      setNotifiedMap(prev => ({ ...prev, [alert.id]: false }))
    }, 4000)
  }

  const handleSimulateAction = (alert) => {
    navigate('/analytics')
  }

  return (
    <div className="space-y-4 h-full flex flex-col justify-between">
      {/* Active Alerts List */}
      <div className="space-y-3 overflow-y-auto max-h-[480px] pr-1">
        {activeAlerts.length === 0 ? (
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 text-center text-emerald-800">
            <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
            <p className="font-bold text-sm">All 12 Demonstration Zones Operating Nominally</p>
            <p className="text-xs text-emerald-600 mt-1">
              No hydraulic pressure or flow breaches currently detected.
            </p>
          </div>
        ) : (
          activeAlerts.map((alert) => {
            const isCritical = alert.severity === 'critical'
            const isExpanded = selectedAlertId === alert.id

            return (
              <div
                key={alert.id}
                className={`rounded-xl border transition-all ${
                  isCritical
                    ? 'bg-rose-50/50 border-rose-300 ring-1 ring-rose-200'
                    : 'bg-amber-50/50 border-amber-300'
                }`}
              >
                {/* Alert Top Row */}
                <div className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg mt-0.5 ${
                        isCritical ? 'bg-rose-600 text-white' : 'bg-amber-500 text-white'
                      }`}>
                        {isCritical ? <AlertCircle className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-sm text-slate-900">{alert.zoneName}</span>
                          <span className="text-[10px] font-mono bg-white text-slate-700 font-bold px-1.5 py-0.5 rounded border border-slate-200 flex items-center gap-0.5">
                            <Mountain className="w-2.5 h-2.5" />
                            {alert.elevation || 1950}m
                          </span>
                          <span className={`px-2 py-0.2 text-[10px] font-extrabold rounded uppercase ${
                            isCritical ? 'bg-rose-100 text-rose-800 border border-rose-200' : 'bg-amber-100 text-amber-800 border border-amber-200'
                          }`}>
                            {alert.severity}
                          </span>
                        </div>

                        <h3 className="text-xs font-bold text-slate-900 mt-1">
                          {alert.title}
                        </h3>
                        <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                          {alert.message}
                        </p>
                      </div>
                    </div>

                    <span className="text-[10px] text-slate-400 font-mono flex-shrink-0">
                      {new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  {/* Why this alert trigger toggle */}
                  <div className="mt-3 pt-2 border-t border-slate-200/80 flex items-center justify-between">
                    <button
                      onClick={() => setSelectedAlertId(prev => prev === alert.id ? null : alert.id)}
                      className="text-xs font-bold text-sky-700 hover:text-sky-900 flex items-center gap-1"
                    >
                      <HelpCircle className="w-3.5 h-3.5" />
                      {isExpanded ? 'Hide Explanation' : 'Why this alert?'}
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleNotifyFieldTeam(alert)}
                        className="px-2.5 py-1 text-[11px] font-bold bg-white text-slate-700 hover:bg-slate-100 border border-slate-300 rounded-lg shadow-sm transition-all flex items-center gap-1"
                      >
                        <Send className="w-3 h-3 text-sky-600" />
                        {notifiedMap[alert.id] ? 'Notified!' : 'Notify Team'}
                      </button>

                      <button
                        onClick={() => acknowledgeAlert(alert.id)}
                        className="px-2.5 py-1 text-[11px] font-bold bg-slate-900 text-white hover:bg-slate-800 rounded-lg shadow-sm transition-all"
                      >
                        Acknowledge
                      </button>
                    </div>
                  </div>
                </div>

                {/* "WHY THIS ALERT?" Expanded Modal / Drawer Section */}
                {isExpanded && (
                  <div className="bg-white p-4 border-t border-slate-200 rounded-b-xl space-y-3 text-xs">
                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-2">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                        Calculated Hydraulic Explanation:
                      </span>
                      <ul className="space-y-1 text-slate-700">
                        <li className="flex items-start gap-1.5">
                          <span className="text-rose-500 font-bold">•</span>
                          <span><strong>Reason:</strong> {alert.reason}</span>
                        </li>
                        <li className="flex items-start gap-1.5">
                          <span className="text-indigo-500 font-bold">•</span>
                          <span><strong>Terrain Constraint:</strong> Zone altitude of {alert.elevation}m adds gravity head resistance.</span>
                        </li>
                      </ul>
                    </div>

                    {/* Recommended Action Box */}
                    <div className="bg-sky-50 p-3 rounded-lg border border-sky-200">
                      <span className="text-[10px] font-bold text-sky-800 uppercase tracking-wider block mb-1">
                        Recommended Decision:
                      </span>
                      <p className="text-xs font-bold text-slate-900">
                        {alert.recommendedAction || 'Increase upstream booster pump output by 12%.'}
                      </p>

                      <div className="mt-2.5 flex justify-end">
                        <button
                          onClick={() => handleSimulateAction(alert)}
                          className="px-3 py-1 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded text-[11px] flex items-center gap-1 shadow-sm transition-colors"
                        >
                          <Play className="w-3 h-3 fill-white" />
                          Simulate Action in What-If Tool →
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>

      {/* Resolved History */}
      {resolvedAlerts.length > 0 && (
        <div className="border-t border-slate-100 pt-3">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
            Recently Resolved ({resolvedAlerts.length}):
          </span>
          <div className="space-y-1.5 max-h-[120px] overflow-y-auto">
            {resolvedAlerts.slice(0, 3).map((a) => (
              <div key={a.id} className="flex items-center justify-between text-[11px] bg-slate-50 px-2.5 py-1.5 rounded text-slate-600">
                <span className="truncate">✓ {a.zoneName}: {a.title}</span>
                <span className="text-[9px] text-slate-400 font-mono">ACKNOWLEDGED</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default AlertFeed
