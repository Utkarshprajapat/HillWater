import { useEffect, useState, useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useData } from '../context/DataContext'
import {
  ArrowLeft,
  Gauge,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Clock,
  MapPin,
  ChevronRight,
  Mountain,
  Droplets,
  Activity,
  Sliders,
  HelpCircle,
  Zap,
  CheckCircle2
} from 'lucide-react'
import {
  AreaChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts'
import { calculateZoneRisk } from '../utils/riskEngine'

const ZoneDetail = () => {
  const { zoneId } = useParams()
  const { zones } = useData()

  const zone = useMemo(() => {
    return zones.find(z => z.id === zoneId || z.name.toLowerCase() === zoneId?.toLowerCase()) || zones[0]
  }, [zones, zoneId])

  const riskAnalysis = useMemo(() => {
    return calculateZoneRisk(zone)
  }, [zone])

  // Generate 24-hour historical pressure trace
  const historyData = useMemo(() => {
    const data = []
    const now = new Date()
    const baseP = zone?.pressure || 2.2

    for (let i = 23; i >= 0; i--) {
      const time = new Date(now)
      time.setHours(time.getHours() - i)
      const varVal = Math.sin(i * 0.4) * 0.2 + (Math.random() * 0.08 - 0.04)
      const p = Number(Math.max(0.8, baseP + varVal).toFixed(2))

      data.push({
        time: time.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
        pressure: p,
        target: zone?.targetPressure || 2.2,
        minTarget: zone?.minPressure || 1.5,
      })
    }
    return data
  }, [zone])

  if (!zone) {
    return (
      <div className="space-y-6">
        <Link to="/zones" className="inline-flex items-center gap-2 text-sky-600 hover:text-sky-700">
          <ArrowLeft className="w-4 h-4" /> Back to Zones Map
        </Link>
        <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
          <p className="text-slate-600">Demonstration Zone not found.</p>
        </div>
      </div>
    )
  }

  const isCritical = riskAnalysis.riskScore >= 75
  const isHigh = riskAnalysis.riskScore >= 55
  const isWarning = riskAnalysis.riskScore >= 35

  return (
    <div className="space-y-6 pb-12">
      {/* Breadcrumb & Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-1">
            <Link to="/zones" className="hover:text-sky-600 flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" />
              Zone Map
            </Link>
            <ChevronRight className="w-3 h-3 text-slate-400" />
            <span>Nainital Network</span>
            <ChevronRight className="w-3 h-3 text-slate-400" />
            <span className="text-slate-900 font-bold">{zone.name}</span>
          </div>

          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black text-slate-900">{zone.name}</h1>
            <span className="text-xs font-mono font-bold bg-sky-100 text-sky-800 px-2.5 py-1 rounded-lg flex items-center gap-1">
              <Mountain className="w-3.5 h-3.5" />
              Elevation: {zone.elevation}m
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Terrain Category: <strong>{zone.terrain || 'Mountain Slope'}</strong> • Demonstration Sector
          </p>
        </div>

        {/* Status Chip */}
        <div className="flex items-center gap-3">
          <div className={`px-4 py-2 rounded-xl border flex items-center gap-2 shadow-sm ${
            isCritical ? 'bg-rose-50 border-rose-200 text-rose-800' :
            isHigh ? 'bg-orange-50 border-orange-200 text-orange-800' :
            isWarning ? 'bg-amber-50 border-amber-200 text-amber-800' :
            'bg-emerald-50 border-emerald-200 text-emerald-800'
          }`}>
            <AlertTriangle className="w-4 h-4" />
            <span className="text-xs font-extrabold uppercase">
              {riskAnalysis.riskLevel} RISK ({riskAnalysis.riskScore}/100)
            </span>
          </div>

          <Link
            to="/analytics"
            className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl shadow-sm flex items-center gap-1.5 transition-colors"
          >
            <Sliders className="w-3.5 h-3.5" />
            Simulate Intervention
          </Link>
        </div>
      </div>

      {/* Key Telemetry Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Hydraulic Pressure</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black text-slate-900 font-mono">{zone.pressure}</span>
            <span className="text-xs text-slate-500">bar</span>
          </div>
          <p className="text-[10px] text-slate-500 mt-1">Min Safe: {zone.minPressure} bar | Target: {zone.targetPressure} bar</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Elevation Head Impact</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black text-sky-700 font-mono">{zone.elevation}</span>
            <span className="text-xs text-slate-500">m ASL</span>
          </div>
          <p className="text-[10px] text-slate-500 mt-1">Head Loss Penalty: +{Math.round(((zone.elevation - 1500) / 760) * 22)} pts</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Flow Delivery / Demand</p>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl font-black text-slate-900 font-mono">{zone.flow}</span>
            <span className="text-xs text-slate-500">/ {zone.demand} L/m</span>
          </div>
          <p className="text-[10px] text-slate-500 mt-1">
            {zone.demand > zone.flow ? `⚠️ Demand deficit: ${zone.demand - zone.flow} L/m` : 'Balanced supply'}
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Storage Tank Buffer</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black text-slate-900 font-mono">{zone.tankLevel}%</span>
            <span className="text-xs text-slate-500">of {zone.tankCapacity || 200} kL</span>
          </div>
          <p className="text-[10px] text-slate-500 mt-1">{zone.tankLevel < 45 ? '⚠️ Storage depleted' : 'Adequate buffer'}</p>
        </div>
      </div>

      {/* Chart & Explainable Diagnosis */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 24-Hour Pressure History Chart (7 cols) */}
        <div className="lg:col-span-7 bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Gauge className="w-4 h-4 text-sky-600" />
              24-Hour Hydraulic Pressure Trace
            </h2>
            <span className="text-xs text-slate-400 font-mono">1.5 bar min limit</span>
          </div>

          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={historyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="detailPressureGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0284C7" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#0284C7" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="time" tick={{ fill: '#64748B', fontSize: 11 }} />
                <YAxis domain={[0.8, 3.8]} tick={{ fill: '#64748B', fontSize: 11 }} />
                <Tooltip contentStyle={{ backgroundColor: '#0F172A', borderRadius: '8px', color: '#FFF', fontSize: '12px' }} />
                <ReferenceLine y={zone.minPressure || 1.5} stroke="#EF4444" strokeDasharray="4 4" label={{ value: 'Minimum Boundary', fill: '#EF4444', fontSize: 10 }} />
                <Area
                  type="monotone"
                  dataKey="pressure"
                  stroke="#0284C7"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#detailPressureGrad)"
                  name="Pressure (bar)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Explainable Diagnosis & Recommendation (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Dynamic "Why is this zone at risk?" card */}
          <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-sky-600" />
              Why is this zone at risk?
            </h3>

            <div className="space-y-2">
              {riskAnalysis.likelyCauses.map((cause, i) => (
                <div key={i} className="bg-white p-3 rounded-lg border border-slate-200">
                  <div className="flex justify-between text-xs font-bold text-slate-800 mb-1">
                    <span>{cause.cause}</span>
                    <span className="text-sky-700 font-mono">{cause.percentage}%</span>
                  </div>
                  <p className="text-xs text-slate-600">{cause.detail}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Recommended Action Card */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-5 rounded-xl shadow-md space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider bg-sky-500/20 text-sky-300 px-2 py-0.5 rounded border border-sky-400/30">
                Recommended Decision
              </span>
            </div>
            <p className="text-sm font-bold text-white leading-snug">
              {riskAnalysis.recommendation.action}
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs bg-slate-800/80 p-2.5 rounded-lg border border-slate-700">
              <div>
                <span className="text-[10px] text-slate-400 block uppercase">Current Pressure</span>
                <span className="font-mono font-bold text-rose-400">{riskAnalysis.recommendation.currentPressure} bar</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block uppercase">Expected Outcome</span>
                <span className="font-mono font-bold text-emerald-400">{riskAnalysis.recommendation.expectedPressure} bar</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ZoneDetail
