import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

const PressureChart = ({ zones = [], timeRange = '24h' }) => {
  const chartColors = [
    '#0284C7', '#6366F1', '#10B981', '#F59E0B', '#EC4899', '#8B5CF6'
  ]

  // Generate simulated comparative trends
  const data = []
  const currentHour = new Date().getHours()
  const displayZones = zones.slice(0, 5)

  for (let i = 23; i >= 0; i--) {
    const h = (currentHour - i + 24) % 24
    const point = { time: `${h}:00` }

    displayZones.forEach((z) => {
      const base = z.pressure || 2.2
      const varVal = Math.sin(i * 0.4 + (z.elevation % 5)) * 0.2
      point[z.name] = Number((base + varVal).toFixed(2))
    })

    data.push(point)
  }

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
          <XAxis dataKey="time" tick={{ fill: '#64748B', fontSize: 11 }} />
          <YAxis domain={[1.0, 4.0]} tick={{ fill: '#64748B', fontSize: 11 }} />
          <Tooltip contentStyle={{ backgroundColor: '#0F172A', borderRadius: '8px', color: '#FFF', fontSize: '12px' }} />
          <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />

          {displayZones.map((z, idx) => (
            <Line
              key={z.id}
              type="monotone"
              dataKey={z.name}
              stroke={chartColors[idx % chartColors.length]}
              strokeWidth={2}
              dot={false}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export default PressureChart
