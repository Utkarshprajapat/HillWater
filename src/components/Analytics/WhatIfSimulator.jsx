import { useState, useMemo } from 'react'
import { useData } from '../../context/DataContext'
import {
  Sliders,
  Play,
  RotateCcw,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  Mountain,
  Gauge,
  Zap,
  Activity
} from 'lucide-react'
import { simulateIntervention } from '../../utils/riskEngine'

const INTERVENTIONS = [
  { id: 'increase_pump', name: 'Increase Booster Pump Output', defaultMag: 12, min: 0, max: 30, unit: '%' },
  { id: 'open_valve', name: 'Modulate / Open Upstream Valve', defaultMag: 10, min: 0, max: 25, unit: '%' },
  { id: 'shift_supply', name: 'Shift Supply from Adjacent Valley Sector', defaultMag: 15, min: 0, max: 35, unit: '%' },
  { id: 'reduce_demand', name: 'Peak Demand Demand-Side Management', defaultMag: 15, min: 0, max: 30, unit: '%' },
  { id: 'restore_tank', name: 'Emergency Feeder Gravity Storage Transfer', defaultMag: 20, min: 0, max: 40, unit: 'kL' },
]

const WhatIfSimulator = () => {
  const { zones, applyZoneIntervention, addLog } = useData()
  const [selectedZoneId, setSelectedZoneId] = useState('')
  const [interventionType, setInterventionType] = useState('increase_pump')
  const [magnitude, setMagnitude] = useState(12)
  const [appliedFeedback, setAppliedFeedback] = useState(false)

  const effectiveZoneId = selectedZoneId || (zones.length > 0 ? zones[0].id : '')

  const selectedZone = useMemo(() => {
    return zones.find(z => z.id === effectiveZoneId || z.name === effectiveZoneId) || zones[0] || {}
  }, [zones, effectiveZoneId])

  const activeIntervention = useMemo(() => {
    return INTERVENTIONS.find(i => i.id === interventionType) || INTERVENTIONS[0]
  }, [interventionType])

  // Compute dynamic before vs after simulation
  const simulationResult = useMemo(() => {
    return simulateIntervention(selectedZone, interventionType, magnitude)
  }, [selectedZone, interventionType, magnitude])

  const handleApplyToNetwork = () => {
    applyZoneIntervention(selectedZone.id, interventionType, magnitude)
    setAppliedFeedback(true)
    setTimeout(() => setAppliedFeedback(false), 3000)
  }

  const riskBadgeColor = (level) => {
    switch (level) {
      case 'CRITICAL': return 'bg-rose-100 text-rose-800 border-rose-200'
      case 'HIGH': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'MEDIUM': return 'bg-amber-100 text-amber-800 border-amber-200'
      default: return 'bg-emerald-100 text-emerald-800 border-emerald-200'
    }
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 text-[10px] font-bold bg-indigo-100 text-indigo-800 rounded uppercase tracking-wider">
              Scenario Modeling
            </span>
            <span className="text-xs text-slate-400">• Dynamic Hydraulic Simulation</span>
          </div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 mt-1">
            <Sliders className="w-5 h-5 text-indigo-600" />
            What-If Scenario & Intervention Simulator
          </h2>
        </div>
        <p className="text-xs text-slate-500 max-w-sm">
          Test operational hydraulic interventions and predict pressure & risk outcomes before executing in the field.
        </p>
      </div>

      {/* Simulator Inputs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-slate-50 p-5 rounded-xl border border-slate-200">
        {/* 1. Zone Selection */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
            <Mountain className="w-3.5 h-3.5 text-sky-600" />
            Target Zone:
          </label>
          <select
            value={effectiveZoneId}
            onChange={(e) => {
              setSelectedZoneId(e.target.value)
              setAppliedFeedback(false)
            }}
            className="w-full bg-white border border-slate-300 text-slate-900 text-xs font-bold rounded-lg p-2.5 shadow-sm focus:ring-2 focus:ring-indigo-500"
          >
            {zones.map(z => (
              <option key={z.id} value={z.id}>
                {z.name} ({z.elevation}m) — Risk {z.riskScore || 0}
              </option>
            ))}
          </select>
          <p className="text-[11px] text-slate-500">
            Elevation: <strong>{selectedZone.elevation}m</strong> • Current: <strong>{selectedZone.pressure} bar</strong>
          </p>
        </div>

        {/* 2. Intervention Selection */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-600" />
            Proposed Intervention:
          </label>
          <select
            value={interventionType}
            onChange={(e) => {
              setInterventionType(e.target.value)
              const selectedInterv = INTERVENTIONS.find(i => i.id === e.target.value)
              if (selectedInterv) setMagnitude(selectedInterv.defaultMag)
              setAppliedFeedback(false)
            }}
            className="w-full bg-white border border-slate-300 text-slate-900 text-xs font-bold rounded-lg p-2.5 shadow-sm focus:ring-2 focus:ring-indigo-500"
          >
            {INTERVENTIONS.map(i => (
              <option key={i.id} value={i.id}>{i.name}</option>
            ))}
          </select>
          <p className="text-[11px] text-slate-500 truncate">
            {activeIntervention.name}
          </p>
        </div>

        {/* 3. Magnitude Slider */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Intervention Magnitude:
            </label>
            <span className="text-xs font-mono font-extrabold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded border border-indigo-200">
              +{magnitude}{activeIntervention.unit}
            </span>
          </div>
          <input
            type="range"
            min={activeIntervention.min}
            max={activeIntervention.max}
            step="1"
            value={magnitude}
            onChange={(e) => {
              setMagnitude(parseInt(e.target.value))
              setAppliedFeedback(false)
            }}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-mono">
            <span>+{activeIntervention.min}{activeIntervention.unit}</span>
            <span>Default (+{activeIntervention.defaultMag}{activeIntervention.unit})</span>
            <span>+{activeIntervention.max}{activeIntervention.unit}</span>
          </div>
        </div>
      </div>

      {/* BEFORE vs AFTER Dynamic Comparison Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        {/* BEFORE CARD */}
        <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 relative overflow-hidden">
          <div className="flex items-center justify-between mb-3 border-b border-slate-200 pb-2">
            <span className="text-xs font-extrabold uppercase tracking-widest text-slate-500">
              BEFORE INTERVENTION
            </span>
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${riskBadgeColor(simulationResult.before.riskLevel)}`}>
              {simulationResult.before.riskLevel} RISK
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400">Pressure</p>
              <p className="text-2xl font-black text-slate-900 font-mono">
                {simulationResult.before.pressure} <span className="text-xs font-normal text-slate-500">bar</span>
              </p>
              <p className="text-[10px] text-slate-500">Target: {selectedZone.targetPressure || 2.2} bar</p>
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400">Risk Score</p>
              <p className="text-2xl font-black text-slate-900 font-mono">
                {simulationResult.before.riskScore} <span className="text-xs font-normal text-slate-400">/ 100</span>
              </p>
              <p className="text-[10px] text-slate-500">Stress Index</p>
            </div>
          </div>
        </div>

        {/* AFTER CARD */}
        <div className="bg-emerald-50/70 p-5 rounded-xl border border-emerald-200 relative overflow-hidden">
          <div className="flex items-center justify-between mb-3 border-b border-emerald-200/60 pb-2">
            <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-800">
              PREDICTED OUTCOME (AFTER)
            </span>
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${riskBadgeColor(simulationResult.after.riskLevel)}`}>
              {simulationResult.after.riskLevel} RISK
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-[10px] uppercase font-bold text-emerald-700">Expected Pressure</p>
              <p className="text-2xl font-black text-emerald-950 font-mono flex items-center gap-1.5">
                {simulationResult.after.pressure} <span className="text-xs font-normal text-emerald-700">bar</span>
                {simulationResult.pressureChange > 0 && (
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-100 px-1.5 py-0.5 rounded">
                    +{simulationResult.pressureChange}
                  </span>
                )}
              </p>
              <p className="text-[10px] text-emerald-700 font-medium">Stabilizes hydraulic head</p>
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-emerald-700">Predicted Risk</p>
              <p className="text-2xl font-black text-emerald-950 font-mono flex items-center gap-1.5">
                {simulationResult.after.riskScore} <span className="text-xs font-normal text-emerald-700">/ 100</span>
                {simulationResult.riskChange < 0 && (
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-100 px-1.5 py-0.5 rounded">
                    {simulationResult.riskChange}
                  </span>
                )}
              </p>
              <p className="text-[10px] text-emerald-700 font-medium">Risk reduced by {Math.abs(simulationResult.riskChange)} pts</p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons & Notice */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-slate-100">
        <p className="text-[11px] text-slate-500">
          ⚠️ <em>Simulated outcome for frontend decision-support. No physical actuators modified.</em>
        </p>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={() => {
              setMagnitude(activeIntervention.defaultMag)
              setAppliedFeedback(false)
            }}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset
          </button>

          <button
            onClick={handleApplyToNetwork}
            className={`flex-1 sm:flex-initial px-5 py-2 text-xs font-bold text-white rounded-lg shadow-sm transition-all flex items-center justify-center gap-2 ${
              appliedFeedback ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-indigo-200'
            }`}
          >
            {appliedFeedback ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                Applied to Live Session!
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-white" />
                Apply Scenario to Dashboard
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default WhatIfSimulator
