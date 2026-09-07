import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useData } from '../context/DataContext'
import {
  Mountain,
  Gauge,
  Droplets,
  ArrowRight,
  Search,
  Activity,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react'

const Page2 = () => {
  const { zones } = useData()
  const [searchTerm, setSearchTerm] = useState('')

  const filteredZones = zones.filter(z =>
    z.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    z.elevation.toString().includes(searchTerm)
  )

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 text-[10px] font-bold bg-sky-100 text-sky-800 rounded uppercase tracking-wider">
              Nainital Demonstration Network
            </span>
            <span className="text-xs text-slate-400">• Sector & DMA Topology</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Distribution Sector & DMA Node Directory
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Complete structural view of the 12 demonstration zones across the 1,500m–2,260m elevation span.
          </p>
        </div>

        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search sector / zone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="text-xs pl-9 pr-4 py-2 border border-slate-300 rounded-lg bg-white shadow-sm focus:ring-2 focus:ring-sky-500 w-56"
          />
        </div>
      </div>

      {/* Network Overview Summary Card */}
      <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-sm border border-slate-800 grid grid-cols-1 md:grid-cols-4 gap-6">
        <div>
          <span className="text-xs font-bold text-sky-400 uppercase tracking-wider block mb-1">Demonstration Grid</span>
          <p className="text-2xl font-black font-mono">12 Zones</p>
          <p className="text-xs text-slate-400 mt-0.5">Nainital Catchment & Ridge</p>
        </div>
        <div>
          <span className="text-xs font-bold text-sky-400 uppercase tracking-wider block mb-1">Altitude Span</span>
          <p className="text-2xl font-black font-mono text-sky-300">1,500m – 2,260m</p>
          <p className="text-xs text-slate-400 mt-0.5">Valley Base to Ridge Crest</p>
        </div>
        <div>
          <span className="text-xs font-bold text-sky-400 uppercase tracking-wider block mb-1">Total Telemetry Nodes</span>
          <p className="text-2xl font-black font-mono text-emerald-400">36 Sensors</p>
          <p className="text-xs text-slate-400 mt-0.5">Pressure, Flow, & Tank Level</p>
        </div>
        <div>
          <span className="text-xs font-bold text-sky-400 uppercase tracking-wider block mb-1">Active Reliability</span>
          <p className="text-2xl font-black font-mono text-amber-300">Predictive Engine</p>
          <p className="text-xs text-slate-400 mt-0.5">Diurnal Demand Modeling</p>
        </div>
      </div>

      {/* 12 Zones Grid with DMA Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredZones.map((zone) => (
          <div key={zone.id} className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4 hover:border-sky-300 transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">{zone.name}</h3>
                  <p className="text-xs text-slate-500">{zone.terrain || 'Hill Topography'}</p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono font-bold bg-sky-100 text-sky-800 px-2 py-0.5 rounded">
                    {zone.elevation}m
                  </span>
                  <span className={`block text-[10px] font-extrabold uppercase mt-1 ${
                    zone.riskScore >= 60 ? 'text-rose-600' : 'text-emerald-600'
                  }`}>
                    {zone.riskLevel}
                  </span>
                </div>
              </div>

              {/* DMA Nodes */}
              <div className="grid grid-cols-2 gap-2 my-3">
                <div className="bg-slate-50 p-2 rounded-lg border border-slate-100 text-xs">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">DMA Node 01</span>
                  <span className="font-bold text-slate-800">Upper Feeder</span>
                  <p className="text-[10px] text-slate-500 font-mono mt-0.5">{zone.pressure} bar</p>
                </div>
                <div className="bg-slate-50 p-2 rounded-lg border border-slate-100 text-xs">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">DMA Node 02</span>
                  <span className="font-bold text-slate-800">Tail-End Draw</span>
                  <p className="text-[10px] text-slate-500 font-mono mt-0.5">{zone.flow} L/m</p>
                </div>
              </div>

              {/* Sensors */}
              <div className="text-[11px] text-slate-600 space-y-1 bg-slate-50 p-2 rounded-lg border border-slate-100">
                <div className="flex justify-between">
                  <span className="font-mono text-slate-400">P-{zone.id}-01:</span>
                  <span className="font-bold text-slate-800">{zone.pressure} bar</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-mono text-slate-400">F-{zone.id}-01:</span>
                  <span className="font-bold text-slate-800">{zone.flow} L/min</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-mono text-slate-400">L-{zone.id}-01:</span>
                  <span className="font-bold text-slate-800">{zone.tankLevel}%</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-slate-700">
                Risk: {zone.riskScore}/100
              </span>
              <Link
                to={`/zone/${zone.id}`}
                className="text-xs font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1 hover:underline"
              >
                Inspect Telemetry <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Page2
