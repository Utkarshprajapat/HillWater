import { Link } from 'react-router-dom'
import { Mountain, Gauge, Droplets, ArrowRight } from 'lucide-react'

const ZoneStatusGrid = ({ zones = [] }) => {
  const getBadgeColor = (riskLevel) => {
    switch (riskLevel) {
      case 'CRITICAL': return 'bg-rose-100 text-rose-800 border-rose-200'
      case 'HIGH': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'MEDIUM': return 'bg-amber-100 text-amber-800 border-amber-200'
      default: return 'bg-emerald-100 text-emerald-800 border-emerald-200'
    }
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {zones.map((zone) => (
        <div
          key={zone.id}
          className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm hover:border-sky-300 hover:shadow-md transition-all flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-sm text-slate-900">{zone.name}</span>
                <span className="text-[10px] font-mono bg-sky-100 text-sky-800 font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5">
                  <Mountain className="w-2.5 h-2.5" />
                  {zone.elevation}m
                </span>
              </div>
              <span className={`px-2 py-0.5 text-[10px] font-extrabold rounded border uppercase ${getBadgeColor(zone.riskLevel)}`}>
                {zone.riskLevel}
              </span>
            </div>

            <p className="text-[10px] text-slate-500 mb-3 truncate">{zone.terrain || 'Hill Slope Zone'}</p>

            {/* Metrics */}
            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center text-slate-700">
                <span className="text-slate-500">Pressure:</span>
                <span className="font-bold font-mono text-slate-900">{zone.pressure} bar</span>
              </div>

              {/* Pressure Bar */}
              <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    zone.pressure < zone.minPressure ? 'bg-rose-500' : 'bg-sky-500'
                  }`}
                  style={{ width: `${Math.min(100, (zone.pressure / (zone.targetPressure || 2.5)) * 100)}%` }}
                />
              </div>

              <div className="flex justify-between items-center text-slate-700 text-[11px]">
                <span className="text-slate-500">Flow / Demand:</span>
                <span className="font-medium font-mono">{zone.flow} / {zone.demand} L/m</span>
              </div>

              <div className="flex justify-between items-center text-slate-700 text-[11px]">
                <span className="text-slate-500">Tank Storage:</span>
                <span className="font-medium font-mono">{zone.tankLevel}%</span>
              </div>
            </div>
          </div>

          <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-500 font-mono">
              Risk {zone.riskScore}/100
            </span>
            <Link
              to={`/zone/${zone.id}`}
              className="text-xs font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1 hover:underline"
            >
              Inspect <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      ))}
    </div>
  )
}

export default ZoneStatusGrid
