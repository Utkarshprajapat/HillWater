import { useState } from 'react'
import { useData } from '../../context/DataContext'
import {
  Radio,
  Activity,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  Search,
  Filter,
  Mountain,
  Gauge,
  Droplets,
  Sliders
} from 'lucide-react'

const SensorManager = () => {
  const { zones, addLog } = useData()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedZoneFilter, setSelectedZoneFilter] = useState('ALL')
  const [pingingSensor, setPingingSensor] = useState(null)

  const handlePing = (sensorId, zoneName) => {
    setPingingSensor(sensorId)
    setTimeout(() => {
      setPingingSensor(null)
      addLog(`Telemetry ping successful for sensor ${sensorId} (${zoneName}). Latency: 24ms.`, zoneName, {
        type: 'Diagnostic'
      })
    }, 800)
  }

  const filteredZones = zones.filter(zone => {
    const matchesSearch = zone.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      zone.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      zone.terrain?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesZone = selectedZoneFilter === 'ALL' || zone.name === selectedZoneFilter || zone.id === selectedZoneFilter
    return matchesSearch && matchesZone
  })

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between flex-wrap gap-4 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 text-[10px] font-bold bg-sky-100 text-sky-800 rounded uppercase tracking-wider">
              IoT Telemetry Grid
            </span>
            <span className="text-xs text-slate-400">• Nainital Demonstration Network</span>
          </div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Radio className="w-5 h-5 text-sky-600" />
            Sensor Fleet Manager (12 Demonstration Zones)
          </h2>
        </div>

        {/* Search & Filter */}
        <div className="flex items-center flex-wrap gap-2">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search sensors / zones..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="text-xs pl-9 pr-3 py-1.5 border border-slate-300 rounded-lg bg-slate-50 focus:ring-2 focus:ring-sky-500 w-44"
            />
          </div>

          <select
            value={selectedZoneFilter}
            onChange={(e) => setSelectedZoneFilter(e.target.value)}
            className="text-xs font-bold bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5"
          >
            <option value="ALL">All 12 Zones</option>
            {zones.map(z => <option key={z.id} value={z.name}>{z.name}</option>)}
          </select>
        </div>
      </div>

      {/* Sensor List Cards */}
      <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
        {filteredZones.map((zone) => (
          <div key={zone.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
            {/* Zone Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-extrabold text-slate-900">{zone.name}</span>
                <span className="text-xs font-mono font-bold bg-sky-100 text-sky-800 px-2 py-0.5 rounded flex items-center gap-1">
                  <Mountain className="w-3 h-3" />
                  {zone.elevation}m
                </span>
                <span className="text-xs text-slate-500 hidden sm:inline">• {zone.terrain}</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold font-mono text-slate-700">Risk: {zone.riskScore}/100</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                  zone.riskLevel === 'CRITICAL' ? 'bg-rose-100 text-rose-800' :
                  zone.riskLevel === 'HIGH' ? 'bg-orange-100 text-orange-800' :
                  zone.riskLevel === 'MEDIUM' ? 'bg-amber-100 text-amber-800' :
                  'bg-emerald-100 text-emerald-800'
                }`}>
                  {zone.riskLevel}
                </span>
              </div>
            </div>

            {/* 3 Telemetry Sensors per Zone */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* Pressure Sensor */}
              <div className="bg-white p-3 rounded-lg border border-slate-200 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-1.5 mb-1">
                    <Gauge className="w-3.5 h-3.5 text-sky-600" />
                    <span className="text-[10px] font-mono font-bold text-slate-500">P-{zone.id}-01</span>
                  </div>
                  <p className="text-xs font-bold text-slate-900">{zone.pressure} bar</p>
                  <p className="text-[9px] text-slate-400">Target: {zone.targetPressure} bar</p>
                </div>
                <button
                  onClick={() => handlePing(`P-${zone.id}-01`, zone.name)}
                  disabled={pingingSensor === `P-${zone.id}-01`}
                  className="p-1.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-600 text-[10px] font-bold transition-all"
                  title="Ping Sensor Telemetry"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${pingingSensor === `P-${zone.id}-01` ? 'animate-spin text-sky-600' : ''}`} />
                </button>
              </div>

              {/* Flow Sensor */}
              <div className="bg-white p-3 rounded-lg border border-slate-200 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-1.5 mb-1">
                    <Droplets className="w-3.5 h-3.5 text-indigo-600" />
                    <span className="text-[10px] font-mono font-bold text-slate-500">F-{zone.id}-01</span>
                  </div>
                  <p className="text-xs font-bold text-slate-900">{zone.flow} L/m</p>
                  <p className="text-[9px] text-slate-400">Demand: {zone.demand} L/m</p>
                </div>
                <button
                  onClick={() => handlePing(`F-${zone.id}-01`, zone.name)}
                  disabled={pingingSensor === `F-${zone.id}-01`}
                  className="p-1.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-600 text-[10px] font-bold transition-all"
                  title="Ping Sensor Telemetry"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${pingingSensor === `F-${zone.id}-01` ? 'animate-spin text-indigo-600' : ''}`} />
                </button>
              </div>

              {/* Tank Sensor */}
              <div className="bg-white p-3 rounded-lg border border-slate-200 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-1.5 mb-1">
                    <Activity className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-[10px] font-mono font-bold text-slate-500">L-{zone.id}-01</span>
                  </div>
                  <p className="text-xs font-bold text-slate-900">{zone.tankLevel}%</p>
                  <p className="text-[9px] text-slate-400">Capacity: {zone.tankCapacity || 200} kL</p>
                </div>
                <button
                  onClick={() => handlePing(`L-${zone.id}-01`, zone.name)}
                  disabled={pingingSensor === `L-${zone.id}-01`}
                  className="p-1.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-600 text-[10px] font-bold transition-all"
                  title="Ping Sensor Telemetry"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${pingingSensor === `L-${zone.id}-01` ? 'animate-spin text-emerald-600' : ''}`} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default SensorManager
