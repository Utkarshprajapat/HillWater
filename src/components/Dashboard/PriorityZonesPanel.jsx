import { Link } from 'react-router-dom'
import { useData } from '../../context/DataContext'
import {
  AlertTriangle,
  ArrowRight,
  Mountain,
  Gauge,
  Droplets,
  TrendingDown,
  CheckCircle2,
  Zap
} from 'lucide-react'

const PriorityZonesPanel = () => {
  const { zones } = useData()

  // Sort zones dynamically by risk score descending
  const topRisks = [...zones]
    .sort((a, b) => (b.riskScore || 0) - (a.riskScore || 0))
    .slice(0, 4)

  const getRiskBadge = (level) => {
    switch (level) {
      case 'CRITICAL':
        return 'bg-rose-100 text-rose-800 border-rose-200'
      case 'HIGH':
        return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'MEDIUM':
        return 'bg-amber-100 text-amber-800 border-amber-200'
      default:
        return 'bg-emerald-100 text-emerald-800 border-emerald-200'
    }
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between h-full">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              Priority Triage • Top Risks
            </h2>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Where should the operator intervene first? (Ranked by Risk Score)
            </p>
          </div>
          <span className="text-[10px] font-mono font-bold bg-slate-100 px-2 py-0.5 rounded text-slate-600">
            LIVE SORT
          </span>
        </div>

        {/* Zones List */}
        <div className="space-y-3">
          {topRisks.map((zone, idx) => {
            const isHighRisk = zone.riskScore >= 60

            return (
              <div
                key={zone.id}
                className={`p-3.5 rounded-xl border transition-all ${
                  isHighRisk 
                    ? 'bg-rose-50/40 border-rose-200 shadow-sm' 
                    : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                }`}
              >
                {/* Zone Header Row */}
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-slate-400">#{idx + 1}</span>
                    <span className="text-sm font-extrabold text-slate-900">{zone.name}</span>
                    <span className="text-[10px] font-mono bg-sky-100 text-sky-800 font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5">
                      <Mountain className="w-2.5 h-2.5" />
                      {zone.elevation}m
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-black font-mono text-slate-900">
                      {zone.riskScore || 0}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold border ${getRiskBadge(zone.riskLevel)}`}>
                      {zone.riskLevel}
                    </span>
                  </div>
                </div>

                {/* Telemetry Strip */}
                <div className="grid grid-cols-3 gap-2 text-[11px] text-slate-600 my-2 font-medium bg-white/80 p-2 rounded-lg border border-slate-100">
                  <div>
                    <span className="text-[9px] text-slate-400 block uppercase">Pressure</span>
                    <span className={`font-bold ${zone.pressure < zone.minPressure ? 'text-rose-600' : 'text-slate-800'}`}>
                      {zone.pressure} bar
                    </span>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-400 block uppercase">Flow / Demand</span>
                    <span className="font-bold text-slate-800">
                      {zone.flow} / {zone.demand} L/m
                    </span>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-400 block uppercase">Tank Level</span>
                    <span className="font-bold text-slate-800">{zone.tankLevel}%</span>
                  </div>
                </div>

                {/* Primary Issue & Recommended Action */}
                <div className="text-[11px] text-slate-600 space-y-1">
                  <p className="truncate">
                    <strong>Primary Driver:</strong> {zone.likelyCauses && zone.likelyCauses[0] ? zone.likelyCauses[0].cause : 'Nominal'}
                  </p>
                  <p className="text-sky-700 font-medium truncate">
                    <strong>Action:</strong> {zone.recommendation?.action || 'Maintain nominal status'}
                  </p>
                </div>

                {/* Inspect Action Link */}
                <div className="mt-2 pt-2 border-t border-slate-200/60 flex justify-end">
                  <Link
                    to={`/zone/${zone.id}`}
                    className="text-xs font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1 hover:underline"
                  >
                    Inspect Zone Diagnostics <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-400 flex items-center justify-between">
        <span>Evaluated against hydraulic head losses</span>
        <Link to="/analytics" className="font-semibold text-slate-600 hover:text-slate-900">
          Open Analytics →
        </Link>
      </div>
    </div>
  )
}

export default PriorityZonesPanel
