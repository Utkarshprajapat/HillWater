import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useData } from '../../context/DataContext'
import {
  Mountain,
  Gauge,
  Droplets,
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ArrowRight,
  Activity
} from 'lucide-react'

const HierarchyStatusView = () => {
  const { zones } = useData()
  const [expandedZoneId, setExpandedZoneId] = useState('MAL')

  const toggleExpand = (id) => {
    setExpandedZoneId(prev => prev === id ? null : id)
  }

  const getStatusBadge = (riskScore, riskLevel) => {
    if (riskScore >= 75 || riskLevel === 'CRITICAL') {
      return <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-rose-100 text-rose-800 border border-rose-200">CRITICAL</span>
    }
    if (riskScore >= 55 || riskLevel === 'HIGH') {
      return <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-orange-100 text-orange-800 border border-orange-200">HIGH RISK</span>
    }
    if (riskScore >= 35 || riskLevel === 'MEDIUM') {
      return <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-amber-100 text-amber-800 border border-amber-200">WARNING</span>
    }
    return <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-200">NOMINAL</span>
  }

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[480px] overflow-y-auto pr-1">
        {zones.map((zone) => {
          const isExpanded = expandedZoneId === zone.id

          return (
            <div
              key={zone.id}
              className={`rounded-xl border transition-all ${
                isExpanded ? 'bg-slate-50 border-sky-300 shadow-sm ring-1 ring-sky-100' : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              {/* Zone Header Button */}
              <button
                onClick={() => toggleExpand(zone.id)}
                className="w-full text-left p-3.5 flex items-center justify-between gap-2"
              >
                <div className="flex items-center gap-2.5">
                  <div className={`p-1.5 rounded-lg ${
                    zone.riskScore >= 60 ? 'bg-rose-100 text-rose-700' : 'bg-sky-50 text-sky-700'
                  }`}>
                    <Mountain className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-extrabold text-sm text-slate-900">{zone.name}</span>
                      <span className="text-[10px] font-mono bg-slate-100 text-slate-700 font-bold px-1.5 py-0.5 rounded">
                        {zone.elevation}m
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-500 block truncate">
                      {zone.terrain || 'Mountain Zone'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <span className="text-xs font-bold font-mono text-slate-800 block">
                      {zone.pressure} bar
                    </span>
                    <span className="text-[10px] text-slate-400">Risk {zone.riskScore}</span>
                  </div>
                  {getStatusBadge(zone.riskScore, zone.riskLevel)}
                  {isExpanded ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}
                </div>
              </button>

              {/* Expanded DMA Node & Sensor Breakdown */}
              {isExpanded && (
                <div className="p-3.5 pt-0 border-t border-slate-200/80 text-xs space-y-3">
                  <div className="grid grid-cols-3 gap-2 bg-white p-2 rounded-lg border border-slate-100 text-slate-600 text-center font-medium">
                    <div>
                      <span className="text-[9px] text-slate-400 block uppercase">Demand Load</span>
                      <span className="font-bold text-slate-800">{zone.demand} L/m</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-400 block uppercase">Delivered Flow</span>
                      <span className="font-bold text-slate-800">{zone.flow} L/m</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-400 block uppercase">Tank Storage</span>
                      <span className="font-bold text-slate-800">{zone.tankLevel}%</span>
                    </div>
                  </div>

                  {/* Sensors Row */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Active Telemetry Nodes:
                    </span>
                    <div className="grid grid-cols-3 gap-1.5 text-[11px] font-mono">
                      {zone.sensors?.map((s) => (
                        <div key={s.id} className="bg-slate-100 p-1.5 rounded text-slate-700 truncate">
                          <span className="text-[9px] text-slate-400 block">{s.id}</span>
                          <span className="font-bold text-slate-900">{s.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Link */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                    <span className="text-[11px] text-slate-500 truncate max-w-[200px]">
                      {zone.likelyCauses && zone.likelyCauses[0]?.cause}
                    </span>
                    <Link
                      to={`/zone/${zone.id}`}
                      className="text-xs font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1 hover:underline"
                    >
                      Full Details <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default HierarchyStatusView
