import { useData } from '../../context/DataContext'
import {
  Activity,
  Droplets,
  Gauge,
  Mountain,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  ShieldCheck,
  Zap
} from 'lucide-react'

const CityOverviewPanel = () => {
  const { zones, systemMetrics, alerts } = useData()

  const healthScore = systemMetrics.health || 88
  const highRiskCount = zones.filter(z => z.riskScore >= 60).length
  const warningCount = zones.filter(z => z.riskScore >= 35 && z.riskScore < 60).length

  return (
    <div className="space-y-4">
      {/* Top Banner: Product positioning statement */}
      <div className="bg-gradient-to-r from-sky-900 via-slate-900 to-slate-950 text-white p-5 rounded-2xl shadow-sm border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 bg-sky-500/20 text-sky-300 text-[10px] font-bold rounded uppercase tracking-wider border border-sky-400/30">
              Nainital Demonstration Network
            </span>
            <span className="text-slate-400 text-xs">• 12 Topographic Sectors</span>
          </div>
          <h1 className="text-xl md:text-2xl font-black tracking-tight text-white">
            HillWater Predictive Command Dashboard
          </h1>
          <p className="text-xs text-slate-300 mt-0.5 font-medium">
            "Monitoring is the input. Decision is the product." — Real-time terrain-aware hydraulic reliability.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-slate-800/80 p-2.5 rounded-xl border border-slate-700/80 self-start md:self-auto">
          <Mountain className="w-6 h-6 text-sky-400" />
          <div className="text-right font-mono">
            <span className="text-[10px] uppercase text-slate-400 block font-sans">Elevation Span</span>
            <span className="text-sm font-bold text-sky-300">1,500m – 2,260m</span>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Network Health Card */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Network Health</span>
            <div className={`p-1.5 rounded-lg ${healthScore >= 80 || healthScore === 'N/A' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="my-2">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-900 font-mono">{healthScore}</span>
              {healthScore !== 'N/A' && <span className="text-xs text-slate-400">/ 100</span>}
              <span className={`text-xs font-bold ${String(systemMetrics.healthTrend).startsWith('-') ? 'text-rose-600' : 'text-slate-400'}`}>
                {systemMetrics.healthTrend}
              </span>
            </div>
            {healthScore !== 'N/A' && (
              <div className="w-full bg-slate-100 rounded-full h-2 mt-2 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    healthScore >= 80 ? 'bg-emerald-500' : healthScore >= 60 ? 'bg-amber-500' : 'bg-rose-500'
                  }`}
                  style={{ width: `${healthScore}%` }}
                />
              </div>
            )}
          </div>
          <p className="text-[10px] text-slate-500">Derived UI Indicator from Risk</p>
        </div>

        {/* Pressure Stability */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pressure Stability</span>
            <div className="p-1.5 rounded-lg bg-sky-50 text-sky-600">
              <Gauge className="w-4 h-4" />
            </div>
          </div>
          <div className="my-2">
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-black text-slate-900 font-mono">
                {systemMetrics.pressureStability}
              </span>
            </div>
            <p className="text-xs text-slate-600 font-medium mt-1">
              Avg Pressure: <strong>{systemMetrics.avgPressure} bar</strong>
            </p>
          </div>
          <p className="text-[10px] text-slate-500">Gradient loss buffer maintained</p>
        </div>

        {/* Flow & Demand */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Flow Delivery</span>
            <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600">
              <Droplets className="w-4 h-4" />
            </div>
          </div>
          <div className="my-2">
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-black text-slate-900 font-mono">
                {systemMetrics.totalFlow !== 'N/A' ? `${(systemMetrics.totalFlow / 1000).toFixed(1)}k` : 'N/A'}
              </span>
              {systemMetrics.totalFlow !== 'N/A' && <span className="text-xs text-slate-400">L/min</span>}
            </div>
            <p className="text-xs text-slate-600 font-medium mt-1">
              Total Demand: <strong>{systemMetrics.totalDemand !== 'N/A' ? `${(systemMetrics.totalDemand / 1000).toFixed(1)}k` : 'N/A'} {systemMetrics.totalDemand !== 'N/A' && 'L/m'}</strong>
            </p>
          </div>
          <p className="text-[10px] text-slate-500">{systemMetrics.flowConsistency} consistency index</p>
        </div>

        {/* Tank Availability */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tank Storage</span>
            <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="my-2">
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-black text-slate-900 font-mono">
                {systemMetrics.tankAvailability}
              </span>
              {systemMetrics.tankAvailability !== 'N/A' && <span className="text-xs text-slate-400">% Avg Level</span>}
            </div>
            {systemMetrics.tankAvailability !== 'N/A' && (
              <div className="w-full bg-slate-100 rounded-full h-2 mt-2 overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${systemMetrics.tankAvailability}%` }} />
              </div>
            )}
          </div>
          <p className="text-[10px] text-slate-500">Feeder reservoir buffer capacity</p>
        </div>

        {/* Active Zone Risks Triage */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Risks</span>
            <div className={`p-1.5 rounded-lg ${highRiskCount > 0 ? 'bg-rose-50 text-rose-600' : 'bg-slate-50 text-slate-400'}`}>
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="my-2">
            <div className="flex items-baseline gap-2">
              <span className={`text-3xl font-black font-mono ${highRiskCount > 0 ? 'text-rose-600' : 'text-slate-900'}`}>
                {highRiskCount}
              </span>
              <span className="text-xs font-bold text-rose-600">Critical / High</span>
            </div>
            <p className="text-xs text-slate-600 font-medium mt-1">
              +<strong>{warningCount}</strong> Warning status zones
            </p>
          </div>
          <p className="text-[10px] text-slate-500">12 total demonstration zones</p>
        </div>
      </div>
    </div>
  )
}

export default CityOverviewPanel
