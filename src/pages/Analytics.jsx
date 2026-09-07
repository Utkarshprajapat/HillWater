import { useState, useMemo } from 'react'
import { useData } from '../context/DataContext'
import {
  TrendingUp,
  Activity,
  Zap,
  Sliders,
  Mountain,
  Filter,
  AlertTriangle
} from 'lucide-react'
import PredictiveAnalysis from '../components/Analytics/PredictiveAnalysis'
import WhatIfSimulator from '../components/Analytics/WhatIfSimulator'
import WaterBehaviorAnalysis from '../components/WaterBehaviorAnalysis'

const Analytics = () => {
  const { zones, systemMetrics } = useData()
  const [selectedZoneId, setSelectedZoneId] = useState('MAL')

  const selectedZone = useMemo(() => {
    return zones.find(z => z.id === selectedZoneId || z.name === selectedZoneId) || zones[0] || {}
  }, [zones, selectedZoneId])

  return (
    <div className="space-y-8 pb-16 animate-fade-in">
      {/* 1. Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 text-[10px] font-bold bg-sky-100 text-sky-800 rounded uppercase tracking-wider">
              Nainital Demonstration Network
            </span>
            <span className="text-xs text-slate-400">• Elevation Range: 1,500m–2,260m</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Predictive Analytics & Decision Support
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time hydraulic modeling, diurnal demand curves, and interactive scenario simulation.
          </p>
        </div>

        {/* Global Zone Selector */}
        <div className="flex items-center gap-2 bg-white p-2 rounded-xl border border-slate-200 shadow-sm">
          <label className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5 pl-1">
            <Mountain className="w-4 h-4 text-sky-600" />
            Focus Zone:
          </label>
          <select
            value={selectedZoneId}
            onChange={(e) => setSelectedZoneId(e.target.value)}
            className="text-xs font-bold bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-900 focus:ring-2 focus:ring-sky-500"
          >
            {zones.map(z => (
              <option key={z.id} value={z.id}>
                {z.name} ({z.elevation}m) {z.riskScore >= 60 ? '⚠️' : ''}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 2. Predictive Analysis Section */}
      <div>
        <PredictiveAnalysis selectedZoneId={selectedZoneId} />
      </div>

      {/* 3. What-If Simulator Section */}
      <div>
        <WhatIfSimulator />
      </div>

      {/* 4. Hydraulic Behavior & Flow-Pressure Deep Dive */}
      <div>
        <WaterBehaviorAnalysis zones={zones} selectedZone={selectedZone} />
      </div>
    </div>
  )
}

export default Analytics
