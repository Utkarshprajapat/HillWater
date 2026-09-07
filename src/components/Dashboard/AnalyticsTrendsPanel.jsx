import { useState, useMemo } from 'react'
import { useData } from '../../context/DataContext'
import {
  TrendingUp,
  TrendingDown,
  Activity,
  Droplets,
  Gauge,
  Mountain,
  AlertTriangle
} from 'lucide-react'
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  AreaChart,
  Area
} from 'recharts'

const AnalyticsTrendsPanel = () => {
  const { zones, systemMetrics } = useData()
  const [timeRange, setTimeRange] = useState('6h')

  const trendData = useMemo(() => {
    const data = []
    const currentHour = new Date().getHours()
    const count = timeRange === '1h' ? 6 : timeRange === '6h' ? 6 : 24
    const intervalMins = timeRange === '1h' ? 10 : 60

    for (let i = count; i >= 0; i--) {
      let label = ''
      if (timeRange === '1h') {
        const minsAgo = i * 10
        label = `-${minsAgo}m`
      } else {
        const h = (currentHour - i + 24) % 24
        label = `${h}:00`
      }

      const avgP = systemMetrics.avgPressure || 2.4
      const variation = Math.sin(i * 0.8) * 0.15
      const flowVariation = Math.cos(i * 0.8) * 120

      data.push({
        time: label,
        pressure: Number(Math.max(1.2, avgP + variation).toFixed(2)),
        flow: Math.round((systemMetrics.totalFlow || 14800) / 10 + flowVariation),
        minTarget: 1.6,
      })
    }
    return data
  }, [timeRange, systemMetrics])

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Activity className="w-5 h-5 text-sky-600" />
            Aggregated Network Hydraulic Trends
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            City-wide pressure and flow stability across the 1,500m–2,260m elevation span.
          </p>
        </div>

        <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
          {['1h', '6h', '24h'].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1 rounded-md font-bold transition-all ${
                timeRange === range ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {range === '1h' ? '1 Hour' : range === '6h' ? '6 Hours' : '24 Hours'}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="h-[260px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={trendData} margin={{ top: 10, right: 15, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="trendPressureGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0284C7" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#0284C7" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
            <XAxis dataKey="time" tick={{ fill: '#64748B', fontSize: 11 }} />
            <YAxis domain={[1.0, 3.5]} tick={{ fill: '#64748B', fontSize: 11 }} />
            <Tooltip
              contentStyle={{ backgroundColor: '#0F172A', borderRadius: '8px', color: '#FFF', fontSize: '12px' }}
            />
            <ReferenceLine y={1.6} stroke="#EF4444" strokeDasharray="3 3" label={{ value: 'Min Pressure Target (1.6 bar)', fill: '#EF4444', fontSize: 10 }} />
            <Area
              type="monotone"
              dataKey="pressure"
              stroke="#0284C7"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#trendPressureGrad)"
              name="Network Avg Pressure (bar)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default AnalyticsTrendsPanel
