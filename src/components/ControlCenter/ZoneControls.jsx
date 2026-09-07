import { useState } from 'react'
import { useData } from '../../context/DataContext'
import {
  Sliders,
  Mountain,
  Gauge,
  Droplets,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Send
} from 'lucide-react'

const ZoneControls = () => {
  const { zones, applyZoneIntervention, addLog } = useData()
  const [selectedZoneId, setSelectedZoneId] = useState('MAL')
  const [pumpBoost, setPumpBoost] = useState(0)
  const [valveModulation, setValveModulation] = useState(0)
  const [successMsg, setSuccessMsg] = useState(false)

  const selectedZone = zones.find(z => z.id === selectedZoneId) || zones[0] || {}

  const handleApply = () => {
    if (pumpBoost !== 0) {
      applyZoneIntervention(selectedZone.id, 'increase_pump', pumpBoost)
    }
    if (valveModulation !== 0) {
      applyZoneIntervention(selectedZone.id, 'open_valve', valveModulation)
    }

    addLog(
      `Zone setpoint adjusted for ${selectedZone.name} (${selectedZone.elevation}m): Pump ${pumpBoost > 0 ? '+' : ''}${pumpBoost}%, Valve ${valveModulation > 0 ? '+' : ''}${valveModulation}%`,
      selectedZone.name,
      { type: 'Control Override' }
    )

    setSuccessMsg(true)
    setTimeout(() => setSuccessMsg(false), 3000)
  }

  const handleReset = () => {
    setPumpBoost(0)
    setValveModulation(0)
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-5">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Sliders className="w-5 h-5 text-sky-600" />
            Zone Pressure & Pump Controls
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Simulated setpoint modulation for feeder valves and booster stations.
          </p>
        </div>
      </div>

      {/* Zone Selector Grid */}
      <div>
        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
          Select Target Zone (12 Demonstration Zones):
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          {zones.map(z => (
            <button
              key={z.id}
              onClick={() => {
                setSelectedZoneId(z.id)
                handleReset()
              }}
              className={`p-2 rounded-lg text-left text-xs font-bold transition-all border ${
                selectedZoneId === z.id
                  ? 'bg-sky-600 text-white border-sky-700 shadow-sm'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <div className="truncate">{z.name}</div>
              <div className={`text-[10px] font-mono ${selectedZoneId === z.id ? 'text-sky-200' : 'text-slate-400'}`}>
                {z.elevation}m • {z.pressure} bar
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Active Zone Status Ribbon */}
      <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div>
          <span className="text-[10px] text-slate-400 uppercase font-bold block">Selected Zone</span>
          <span className="font-extrabold text-slate-900">{selectedZone.name}</span>
        </div>
        <div>
          <span className="text-[10px] text-slate-400 uppercase font-bold block">Elevation</span>
          <span className="font-extrabold text-sky-700">{selectedZone.elevation} m</span>
        </div>
        <div>
          <span className="text-[10px] text-slate-400 uppercase font-bold block">Current Pressure</span>
          <span className="font-extrabold text-slate-900">{selectedZone.pressure} bar</span>
        </div>
        <div>
          <span className="text-[10px] text-slate-400 uppercase font-bold block">Risk Level</span>
          <span className="font-extrabold text-slate-900">{selectedZone.riskLevel} ({selectedZone.riskScore}/100)</span>
        </div>
      </div>

      {/* Sliders */}
      <div className="space-y-4">
        <div>
          <div className="flex justify-between text-xs font-bold text-slate-700 mb-1.5">
            <span>Booster Pump Output Adjustment</span>
            <span className="font-mono text-sky-600">{pumpBoost > 0 ? `+${pumpBoost}%` : `${pumpBoost}%`}</span>
          </div>
          <input
            type="range"
            min="-10"
            max="30"
            step="1"
            value={pumpBoost}
            onChange={(e) => setPumpBoost(parseInt(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-sky-600"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
            <span>-10%</span>
            <span>0% (Nominal)</span>
            <span>+30%</span>
          </div>
        </div>

        <div>
          <div className="flex justify-between text-xs font-bold text-slate-700 mb-1.5">
            <span>Pressure Control Valve Modulation</span>
            <span className="font-mono text-indigo-600">{valveModulation > 0 ? `+${valveModulation}%` : `${valveModulation}%`}</span>
          </div>
          <input
            type="range"
            min="-15"
            max="25"
            step="1"
            value={valveModulation}
            onChange={(e) => setValveModulation(parseInt(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
            <span>-15% (Throttle)</span>
            <span>0%</span>
            <span>+25% (Open)</span>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-100">
        <button
          onClick={handleReset}
          className="px-3.5 py-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
        >
          Reset
        </button>

        <button
          onClick={handleApply}
          className="px-5 py-2 text-xs font-bold bg-sky-600 hover:bg-sky-700 text-white rounded-lg shadow-sm transition-all flex items-center gap-1.5"
        >
          {successMsg ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-emerald-300" />
              Setpoints Dispatched!
            </>
          ) : (
            <>
              <Send className="w-3.5 h-3.5" />
              Apply Setpoints to Simulation
            </>
          )}
        </button>
      </div>
    </div>
  )
}

export default ZoneControls
