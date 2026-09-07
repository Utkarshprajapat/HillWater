import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useData } from '../context/DataContext'
import CityMap from '../components/Dashboard/CityMap'
import {
  Mountain,
  Gauge,
  Droplets,
  ArrowRight,
  Search,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  Activity,
  Layers
} from 'lucide-react'

const ZoneMap = () => {
  const { zones } = useData()
  const [selectedZone, setSelectedZone] = useState(zones[0] || null)
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()

  const filteredZones = zones.filter(z =>
    z.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    z.elevation.toString().includes(searchQuery) ||
    z.terrain?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const activeZone = selectedZone || zones[0]

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 text-[10px] font-bold bg-sky-100 text-sky-800 rounded uppercase tracking-wider">
              Geospatial Topography
            </span>
            <span className="text-xs text-slate-400">• Nainital Demonstration Network</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Terrain Zone Map & Topographic Distribution
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Geographic overview of water distribution mapped across mountain gradients (1,500m–2,260m).
          </p>
        </div>

        {/* Quick Search */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Filter zone or elevation..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="text-xs pl-9 pr-4 py-2 border border-slate-300 rounded-lg bg-white shadow-sm focus:ring-2 focus:ring-sky-500 w-64"
          />
        </div>
      </div>

      {/* Main Grid: GIS Map (Left 8 cols) + Selected Zone Telemetry Panel (Right 4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Map Container (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <CityMap
            zones={filteredZones}
            selectedZone={activeZone}
            onZoneSelect={(z) => setSelectedZone(z)}
          />

          {/* Elevation Profile Quick Strip */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Mountain className="w-3.5 h-3.5 text-sky-600" />
                Network Elevation Profile (Ridge to Valley)
              </span>
              <span className="text-[10px] font-mono text-slate-400">12 Demonstration Zones</span>
            </div>

            <div className="flex items-end gap-1.5 h-16 pt-2 overflow-x-auto">
              {[...zones].sort((a, b) => b.elevation - a.elevation).map((z) => {
                const heightPercent = Math.max(25, ((z.elevation - 1400) / (2300 - 1400)) * 100)
                const isSelected = activeZone?.id === z.id

                return (
                  <button
                    key={z.id}
                    onClick={() => setSelectedZone(z)}
                    className="flex-1 flex flex-col items-center group min-w-[50px]"
                    title={`${z.name}: ${z.elevation}m`}
                  >
                    <div
                      className={`w-full rounded-t transition-all ${
                        isSelected 
                          ? 'bg-sky-600' 
                          : z.riskScore >= 60 
                            ? 'bg-rose-400 hover:bg-rose-500' 
                            : 'bg-slate-300 hover:bg-slate-400'
                      }`}
                      style={{ height: `${heightPercent}%` }}
                    />
                    <span className={`text-[9px] font-mono font-bold mt-1 truncate max-w-[48px] ${
                      isSelected ? 'text-sky-600' : 'text-slate-500'
                    }`}>
                      {z.id}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Selected Zone Telemetry Panel (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          {activeZone && (
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-lg font-black text-slate-900">{activeZone.name}</h3>
                  <span className="text-xs text-slate-500">{activeZone.terrain || 'Hill Topographic Sector'}</span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono font-bold bg-sky-100 text-sky-800 px-2 py-0.5 rounded block">
                    {activeZone.elevation} m
                  </span>
                  <span className={`text-[9px] font-extrabold uppercase mt-1 inline-block px-1.5 py-0.5 rounded ${
                    activeZone.riskLevel === 'CRITICAL' ? 'bg-rose-100 text-rose-800' :
                    activeZone.riskLevel === 'HIGH' ? 'bg-orange-100 text-orange-800' :
                    activeZone.riskLevel === 'MEDIUM' ? 'bg-amber-100 text-amber-800' :
                    'bg-emerald-100 text-emerald-800'
                  }`}>
                    {activeZone.riskLevel} RISK
                  </span>
                </div>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <span className="text-[10px] text-slate-400 uppercase block font-bold">Pressure</span>
                  <span className="text-base font-extrabold text-slate-900 font-mono">{activeZone.pressure} bar</span>
                  <span className="text-[10px] text-slate-500 block">Target: {activeZone.targetPressure} bar</span>
                </div>

                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <span className="text-[10px] text-slate-400 uppercase block font-bold">Risk Score</span>
                  <span className="text-base font-extrabold text-slate-900 font-mono">{activeZone.riskScore} / 100</span>
                  <span className="text-[10px] text-slate-500 block">Stress Index</span>
                </div>

                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <span className="text-[10px] text-slate-400 uppercase block font-bold">Flow / Demand</span>
                  <span className="text-xs font-bold text-slate-900 font-mono">{activeZone.flow} / {activeZone.demand}</span>
                  <span className="text-[10px] text-slate-500 block">L/min</span>
                </div>

                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <span className="text-[10px] text-slate-400 uppercase block font-bold">Tank Level</span>
                  <span className="text-base font-extrabold text-slate-900 font-mono">{activeZone.tankLevel}%</span>
                  <span className="text-[10px] text-slate-500 block">Cap: {activeZone.tankCapacity} kL</span>
                </div>
              </div>

              {/* Recommended Action */}
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                <span className="text-[10px] font-bold text-sky-700 uppercase tracking-wider block mb-1">
                  Active Decision Guidance:
                </span>
                <p className="text-xs text-slate-700 font-medium">
                  {activeZone.recommendation?.action || 'Maintain nominal setpoint.'}
                </p>
              </div>

              <Link
                to={`/zone/${activeZone.id}`}
                className="w-full py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-lg shadow-sm flex items-center justify-center gap-1.5 transition-colors"
              >
                Inspect Zone Telemetry <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}

          {/* Network Key Insights Card */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              🏔️ Topographic Key Insights
            </h4>
            <div className="space-y-2 text-xs">
              <div className="p-2.5 bg-emerald-50 rounded-lg border border-emerald-100 text-emerald-900">
                <span className="font-bold block text-[11px]">Highest Zone: Ayarpatta (2,260m)</span>
                <span className="text-[11px] text-emerald-700">Requires dedicated booster stage to overcome steep ridge gradient.</span>
              </div>
              <div className="p-2.5 bg-sky-50 rounded-lg border border-sky-100 text-sky-900">
                <span className="font-bold block text-[11px]">Tourist Pressure Corridor</span>
                <span className="text-[11px] text-sky-700">Mallital, Mall Road & Bara Bazaar absorb 45% of peak hospitality draw.</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-slate-700">
                <span className="font-bold block text-[11px]">Valley Base: Talli Bamouri (1,500m)</span>
                <span className="text-[11px] text-slate-600">Serves as feeder buffer point with lowest gravity head loss.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ZoneMap
