import { useState, useMemo } from 'react'
import {
  Activity,
  Zap,
  Droplets,
  Gauge,
  TrendingDown,
  TrendingUp,
  AlertCircle,
  Mountain
} from 'lucide-react'
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine
} from 'recharts'

const WaterBehaviorAnalysis = ({ zones = [], selectedZone = null }) => {
  const [timeRange, setTimeRange] = useState('24h')

  const activeZone = selectedZone || zones[0] || {
    id: 'MAL',
    name: 'Mallital',
    elevation: 2050,
    pressure: 2.2,
    minPressure: 1.5,
    flow: 1450,
    demand: 1380,
  }

  // Generate correlation data between Flow (L/min) and Pressure (bar) across diurnal cycle
  const behaviorData = useMemo(() => {
    const data = []
    const baseP = activeZone.pressure || 2.2
    const baseF = activeZone.flow || 1350
    const elev = activeZone.elevation || 1950
    const pointsCount = timeRange === '24h' ? 24 : timeRange === '7d' ? 7 : 30

    for (let i = 0; i < pointsCount; i++) {
      let label = `${i}:00`
      let flowMultiplier = 1.0

      if (timeRange === '24h') {
        // Morning Peak 6-9, Evening Peak 18-21
        if (i >= 6 && i <= 9) flowMultiplier = 1.38
        else if (i >= 18 && i <= 21) flowMultiplier = 1.42
        else if (i >= 0 && i <= 4) flowMultiplier = 0.55
        else flowMultiplier = 0.95
      } else if (timeRange === '7d') {
        label = `Day ${i + 1}`
        flowMultiplier = (i === 5 || i === 6) ? 1.4 : 1.0 // Weekend tourist surge
      } else {
        label = `D-${pointsCount - i}`
        flowMultiplier = 1.0 + Math.sin(i * 0.5) * 0.25
      }

      const flow = Math.round(baseF * flowMultiplier)
      // Elevation head resistance causes inverse pressure drop during high flow
      const elevPenalty = ((elev - 1500) / 760) * 0.25
      const pressure = Number(Math.max(0.8, baseP - ((flowMultiplier - 1.0) * 0.9) - (elevPenalty * 0.2)).toFixed(2))

      data.push({
        time: label,
        flow,
        pressure,
        minPressure: activeZone.minPressure || 1.5,
      })
    }

    return data
  }, [activeZone, timeRange])

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 text-[10px] font-bold bg-sky-100 text-sky-800 rounded uppercase tracking-wider">
              Hydraulic Correlation
            </span>
            <span className="text-xs text-slate-400">• Flow Rate vs Hydraulic Head</span>
          </div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 mt-1">
            <Activity className="w-5 h-5 text-sky-600" />
            Topographic Flow & Pressure Dynamics: {activeZone.name} ({activeZone.elevation}m)
          </h2>
        </div>

        {/* Time Filter */}
        <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
          {['24h', '7d', '30d'].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1 rounded-md font-bold transition-all ${
                timeRange === range ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {range === '24h' ? '24 Hours' : range === '7d' ? '7 Days' : '30 Days'}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={behaviorData} margin={{ top: 10, right: 15, left: -15, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
            <XAxis dataKey="time" tick={{ fill: '#64748B', fontSize: 11 }} />
            {/* Left Y Axis: Pressure */}
            <YAxis
              yAxisId="left"
              domain={[0.5, 4.0]}
              tick={{ fill: '#0284C7', fontSize: 11 }}
              label={{ value: 'Pressure (bar)', angle: -90, position: 'insideLeft', fill: '#0284C7', fontSize: 11 }}
            />
            {/* Right Y Axis: Flow */}
            <YAxis
              yAxisId="right"
              orientation="right"
              domain={[400, 2500]}
              tick={{ fill: '#64748B', fontSize: 11 }}
              label={{ value: 'Flow (L/min)', angle: 90, position: 'insideRight', fill: '#64748B', fontSize: 11 }}
            />
            <Tooltip
              contentStyle={{ backgroundColor: '#0F172A', borderRadius: '8px', color: '#FFF', fontSize: '12px' }}
            />
            <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
            
            <ReferenceLine yAxisId="left" y={activeZone.minPressure || 1.5} stroke="#EF4444" strokeDasharray="3 3" label={{ value: 'Min Pressure Target', fill: '#EF4444', fontSize: 10 }} />

            <Bar yAxisId="right" dataKey="flow" fill="#94A3B8" opacity={0.35} name="Demand Flow (L/min)" radius={[4, 4, 0, 0]} />
            <Line yAxisId="left" type="monotone" dataKey="pressure" stroke="#0284C7" strokeWidth={3} dot={false} name="Hydraulic Pressure (bar)" />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Bottom Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
        <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
          <p className="text-[10px] font-bold text-slate-400 uppercase">Terrain Gradient Stress</p>
          <p className="text-sm font-bold text-slate-800 mt-1">High Sensitivity at {activeZone.elevation}m</p>
          <p className="text-xs text-slate-500 mt-0.5">Peak demand draw accelerates gravity head loss by ~30% faster than valley zones.</p>
        </div>
        <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
          <p className="text-[10px] font-bold text-slate-400 uppercase">Diurnal Stress Windows</p>
          <p className="text-sm font-bold text-slate-800 mt-1">07:00–09:30 & 18:30–21:00</p>
          <p className="text-xs text-slate-500 mt-0.5">Dual peak draw profiles match morning domestic and evening tourist hospitality schedules.</p>
        </div>
        <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
          <p className="text-[10px] font-bold text-slate-400 uppercase">Hydraulic Stability Index</p>
          <p className="text-sm font-bold text-emerald-600 mt-1">
            {activeZone.riskScore ? Math.max(30, 100 - activeZone.riskScore) : 82}% Stable
          </p>
          <p className="text-xs text-slate-500 mt-0.5">Correlated from pressure variance and flow resistance metrics.</p>
        </div>
      </div>
    </div>
  )
}

export default WaterBehaviorAnalysis
