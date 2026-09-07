import { useState, useMemo } from 'react'
import { useData } from '../../context/DataContext'
import {
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  Clock,
  Zap,
  Activity,
  Droplets,
  Mountain,
  CheckCircle2,
  Gauge,
  HelpCircle,
  ArrowRight
} from 'lucide-react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Area,
  AreaChart
} from 'recharts'
import { calculateZoneRisk } from '../../utils/riskEngine'

const PredictiveAnalysis = ({ selectedZoneId = 'MAL' }) => {
  const { zones } = useData()
  const [activeZoneId, setActiveZoneId] = useState(selectedZoneId || 'MAL')

  const currentZone = useMemo(() => {
    return zones.find(z => z.id === activeZoneId || z.name === activeZoneId) || zones[0] || {}
  }, [zones, activeZoneId])

  // Calculate live dynamic risk analysis based on actual zone telemetry
  const riskAnalysis = useMemo(() => {
    return calculateZoneRisk(currentZone)
  }, [currentZone])

  // Generate 10-hour hydraulic trend data (4h historical + 6h predictive forecast)
  const chartData = useMemo(() => {
    const data = []
    const currentHour = new Date().getHours()
    const baseP = currentZone.pressure || 2.2
    const trend = currentZone.pressureTrend || -0.05
    const elev = currentZone.elevation || 1950

    // 4 Hours historical
    for (let i = 4; i >= 1; i--) {
      const h = (currentHour - i + 24) % 24
      const p = Number((baseP - (trend * i * 1.2) + (Math.sin(i) * 0.08)).toFixed(2))
      data.push({
        time: `${h}:00`,
        history: p,
        forecast: null,
        minTarget: currentZone.minPressure || 1.5,
        target: currentZone.targetPressure || 2.2,
      })
    }

    // Current point
    data.push({
      time: `${currentHour}:00`,
      history: baseP,
      forecast: baseP,
      minTarget: currentZone.minPressure || 1.5,
      target: currentZone.targetPressure || 2.2,
    })

    // 6 Hours predictive forecast
    for (let i = 1; i <= 6; i++) {
      const h = (currentHour + i) % 24
      // Elevation head resistance steepens afternoon/evening drop
      const diurnalFactor = (h >= 18 && h <= 21) ? -0.25 : (h >= 6 && h <= 9) ? -0.2 : 0.05
      const elevDrop = ((elev - 1500) / 760) * 0.08
      const p = Number(Math.max(0.8, baseP + (trend * i) + diurnalFactor - (elevDrop * (i / 3))).toFixed(2))

      data.push({
        time: `${h}:00 (F)`,
        history: null,
        forecast: p,
        minTarget: currentZone.minPressure || 1.5,
        target: currentZone.targetPressure || 2.2,
      })
    }

    return data
  }, [currentZone])

  const riskBadgeColors = {
    LOW: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    MEDIUM: 'bg-amber-50 text-amber-700 border-amber-200',
    HIGH: 'bg-orange-50 text-orange-700 border-orange-200',
    CRITICAL: 'bg-rose-50 text-rose-700 border-rose-200',
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-6">
      {/* Header & Zone Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 text-[10px] font-bold bg-sky-100 text-sky-800 rounded uppercase tracking-wider">
              Hydraulic AI Horizon
            </span>
            <span className="text-xs text-slate-400">• Terrain-Aware Prediction</span>
          </div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Zap className="w-5 h-5 text-sky-600" />
            Predictive Zone Reliability Analysis
          </h2>
        </div>

        {/* Zone Selector */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-slate-500 uppercase">Select Zone:</label>
          <select
            value={activeZoneId}
            onChange={(e) => setActiveZoneId(e.target.value)}
            className="text-xs font-bold bg-slate-50 border border-slate-300 text-slate-800 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-sky-500 focus:outline-none"
          >
            {zones.map(z => (
              <option key={z.id} value={z.id}>
                {z.name} ({z.elevation}m) {z.riskScore >= 60 ? '⚠️' : ''}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Top Metrics Ribbon for Selected Zone */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Elevation</p>
          <p className="text-base font-extrabold text-slate-900 flex items-center gap-1 mt-0.5">
            <Mountain className="w-4 h-4 text-sky-600" />
            {currentZone.elevation || 1950} m
          </p>
          <p className="text-[10px] text-slate-500 truncate">{currentZone.terrain || 'Mountain Flank'}</p>
        </div>

        <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Current Pressure</p>
          <p className="text-base font-extrabold text-slate-900 mt-0.5">
            {currentZone.pressure} <span className="text-xs font-normal text-slate-500">bar</span>
          </p>
          <p className="text-[10px] text-slate-500">Target: {currentZone.targetPressure} bar</p>
        </div>

        <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Pressure Trend</p>
          <p className={`text-base font-extrabold flex items-center gap-1 mt-0.5 ${
            (currentZone.pressureTrend || 0) < 0 ? 'text-rose-600' : 'text-emerald-600'
          }`}>
            {(currentZone.pressureTrend || 0) < 0 ? <TrendingDown className="w-4 h-4" /> : <TrendingUp className="w-4 h-4" />}
            {currentZone.pressureTrend || -0.05} bar/h
          </p>
          <p className="text-[10px] text-slate-500">Gradient decline</p>
        </div>

        <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Flow vs Demand</p>
          <p className="text-base font-extrabold text-slate-900 mt-0.5">
            {currentZone.flow} <span className="text-[10px] font-normal text-slate-500">/ {currentZone.demand} L/m</span>
          </p>
          <p className="text-[10px] text-slate-500">Deficit: {Math.max(0, currentZone.demand - currentZone.flow)} L/m</p>
        </div>

        <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Tank Storage</p>
          <p className="text-base font-extrabold text-slate-900 mt-0.5">
            {currentZone.tankLevel}%
          </p>
          <p className="text-[10px] text-slate-500">Cap: {currentZone.tankCapacity || 200} kL</p>
        </div>

        <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Zone Risk Score</p>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-base font-extrabold text-slate-900">
              {riskAnalysis.riskScore} <span className="text-xs font-normal text-slate-400">/ 100</span>
            </span>
            <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold border ${riskBadgeColors[riskAnalysis.riskLevel]}`}>
              {riskAnalysis.riskLevel}
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: Forecast Chart (Left) + Explainable Root-Cause & Recommendation (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: 10-Hour Dynamic Pressure Horizon (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <Activity className="w-4 h-4 text-sky-600" />
              Dynamic Pressure Forecast Horizon (Next 6 Hours)
            </h3>
            <span className="text-[11px] text-slate-500">
              Solid: History | <span className="text-sky-600 font-semibold">Dashed: Predictive</span>
            </span>
          </div>

          <div className="h-[260px] w-full bg-slate-50 rounded-lg p-2 border border-slate-100">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 10, right: 15, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="time" tick={{ fill: '#64748B', fontSize: 11 }} />
                <YAxis domain={[0.5, 4.0]} tick={{ fill: '#64748B', fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0F172A', borderRadius: '8px', color: '#FFF', fontSize: '12px' }}
                  itemStyle={{ color: '#E2E8F0' }}
                />
                <ReferenceLine y={currentZone.minPressure || 1.5} stroke="#EF4444" strokeDasharray="4 4" label={{ value: 'Min Threshold', fill: '#EF4444', fontSize: 10, position: 'insideTopLeft' }} />
                
                {/* Historical Line */}
                <Line
                  type="monotone"
                  dataKey="history"
                  stroke="#475569"
                  strokeWidth={2.5}
                  dot={{ fill: '#475569', r: 3 }}
                  name="Historical Pressure (bar)"
                />

                {/* Forecast Line */}
                <Line
                  type="monotone"
                  dataKey="forecast"
                  stroke="#0284C7"
                  strokeWidth={3}
                  strokeDasharray="5 5"
                  dot={{ fill: '#0284C7', r: 4 }}
                  name="Forecast Pressure (bar)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Predicted Failure Horizon Alert Box */}
          <div className={`p-4 rounded-xl border flex items-start gap-3 ${
            riskAnalysis.riskScore >= 60 ? 'bg-rose-50 border-rose-200 text-rose-900' : 'bg-sky-50 border-sky-200 text-sky-900'
          }`}>
            <AlertTriangle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
              riskAnalysis.riskScore >= 60 ? 'text-rose-600' : 'text-sky-600'
            }`} />
            <div className="flex-1 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold uppercase tracking-wider">
                  Predicted Issue: {riskAnalysis.predictedIssue}
                </span>
                <span className="font-mono font-bold bg-white/80 px-2 py-0.5 rounded border border-current">
                  Time: {riskAnalysis.estimatedTimeHorizon}
                </span>
              </div>
              <p className="mt-1 text-slate-600">
                Topographic head loss at {currentZone.elevation}m altitude combined with demand dynamics will reach minimum critical boundary unless mitigated.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Explainable WHY? Contributing Factors & Recommended Action (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* WHY? Dynamic Factor Breakdown */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center justify-between mb-3 border-b border-slate-200 pb-2">
              <span className="flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5 text-sky-600" />
                Why is this zone at risk?
              </span>
              <span className="text-[10px] text-slate-400 font-normal">Calculated Breakdown</span>
            </h3>

            <div className="space-y-3">
              {/* Demand vs Supply */}
              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                  <span>Demand vs Supply Load</span>
                  <span className="font-mono text-sky-700 font-bold">{riskAnalysis.factors.demandSupplyDeficit}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                  <div className="bg-sky-600 h-full rounded-full transition-all duration-500" style={{ width: `${riskAnalysis.factors.demandSupplyDeficit}%` }} />
                </div>
              </div>

              {/* Pressure Trend */}
              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                  <span>Pressure Gradient Trend</span>
                  <span className="font-mono text-rose-600 font-bold">{riskAnalysis.factors.pressureTrend}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                  <div className="bg-rose-500 h-full rounded-full transition-all duration-500" style={{ width: `${riskAnalysis.factors.pressureTrend}%` }} />
                </div>
              </div>

              {/* Elevation Head Constraint */}
              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                  <span>Elevation Head Constraint ({currentZone.elevation}m)</span>
                  <span className="font-mono text-indigo-700 font-bold">{riskAnalysis.factors.elevationConstraint}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                  <div className="bg-indigo-600 h-full rounded-full transition-all duration-500" style={{ width: `${riskAnalysis.factors.elevationConstraint}%` }} />
                </div>
              </div>

              {/* Tank Level Stress */}
              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                  <span>Tank Buffer Storage Deficit</span>
                  <span className="font-mono text-amber-700 font-bold">{riskAnalysis.factors.tankLevel}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                  <div className="bg-amber-500 h-full rounded-full transition-all duration-500" style={{ width: `${riskAnalysis.factors.tankLevel}%` }} />
                </div>
              </div>
            </div>

            {/* Root Causes Bullet List */}
            <div className="mt-4 pt-3 border-t border-slate-200">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Likely Root Causes:</p>
              <ul className="space-y-1.5 text-xs text-slate-700">
                {riskAnalysis.likelyCauses.map((cause, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-sky-600 font-bold">•</span>
                    <span><strong>{cause.cause}:</strong> {cause.detail}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Recommended Action Card */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-4 rounded-xl shadow-md space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider bg-sky-500/30 text-sky-300 px-2 py-0.5 rounded border border-sky-400/40">
                Recommended Decision
              </span>
              <span className="text-[10px] text-slate-400">Decision-Support Engine</span>
            </div>

            <p className="text-sm font-bold text-white leading-snug">
              {riskAnalysis.recommendation.action}
            </p>

            <div className="grid grid-cols-2 gap-2 text-xs bg-slate-800/80 p-2.5 rounded-lg border border-slate-700">
              <div>
                <span className="text-[10px] text-slate-400 block uppercase">Current State</span>
                <span className="font-mono font-bold text-rose-400">{riskAnalysis.recommendation.currentPressure} bar | Risk {riskAnalysis.recommendation.currentRisk}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block uppercase">Expected Outcome</span>
                <span className="font-mono font-bold text-emerald-400">{riskAnalysis.recommendation.expectedPressure} bar | Risk {riskAnalysis.recommendation.expectedRisk}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PredictiveAnalysis
