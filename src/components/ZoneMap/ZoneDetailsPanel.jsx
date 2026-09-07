import { Activity, Gauge, Droplets, MapPin, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const ZoneDetailsPanel = ({ zone }) => {
    // Empty State
    if (!zone) {
        return (
            <div className="h-full min-h-[400px] flex flex-col items-center justify-center p-8 text-center bg-white rounded-lg border border-municipal-gray-200 border-dashed">
                <div className="w-16 h-16 bg-municipal-gray-50 rounded-full flex items-center justify-center mb-4">
                    <MapPin className="w-8 h-8 text-municipal-gray-300" />
                </div>
                <h3 className="text-lg font-semibold text-municipal-gray-900 mb-2">
                    No Zone Selected
                </h3>
                <p className="text-sm text-municipal-gray-500 max-w-xs mx-auto">
                    Select a zone from the map above to view its real-time status, pressure metrics, and operational details.
                </p>
            </div>
        )
    }

    // Status helpers
    const getStatusColor = () => {
        if (zone.pressure < zone.minPressure) return { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', label: 'Critical' }
        if (zone.pressure < zone.minPressure * 1.1) return { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', label: 'Warning' }
        return { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200', label: 'Normal' }
    }

    const status = getStatusColor()

    // Mock trend data
    const generateTrend = (baseValue) => {
        return Array.from({ length: 24 }, (_, i) => ({
            time: `${i}:00`,
            value: Math.max(0, baseValue + (Math.random() - 0.5) * 5)
        }))
    }
    const pressureTrend = generateTrend(zone.pressure)

    return (
        <div className="h-full bg-white rounded-lg border border-municipal-gray-200 shadow-sm overflow-hidden flex flex-col animate-in fade-in duration-300">
            {/* Header */}
            <div className={`px-6 py-4 border-b border-municipal-gray-200 ${status.bg}`}>
                <div className="flex items-start justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-municipal-gray-900">{zone.name}</h2>
                        <div className="flex items-center gap-2 mt-1">
                            <MapPin className="w-3.5 h-3.5 text-municipal-gray-500" />
                            <span className="text-sm text-municipal-gray-600">{zone.area}</span>
                        </div>
                    </div>
                    <span className={`px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wide border ${status.bg} ${status.text} ${status.border}`}>
                        {status.label}
                    </span>
                </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6 flex-1 overflow-y-auto">
                {/* Metrics Grid */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-municipal-gray-50 rounded-lg border border-municipal-gray-100">
                        <div className="flex items-center gap-2 mb-2">
                            <Gauge className="w-4 h-4 text-municipal-gray-500" />
                            <span className="text-xs font-semibold text-municipal-gray-500 uppercase">Pressure</span>
                        </div>
                        <div className="flex items-baseline gap-1">
                            <span className="text-3xl font-bold text-municipal-gray-900">{zone.pressure}</span>
                            <span className="text-sm text-municipal-gray-500">PSI</span>
                        </div>
                        <div className="mt-1 text-xs text-municipal-gray-400">
                            Min Required: {zone.minPressure} PSI
                        </div>
                    </div>

                    <div className="p-4 bg-municipal-gray-50 rounded-lg border border-municipal-gray-100">
                        <div className="flex items-center gap-2 mb-2">
                            <Droplets className="w-4 h-4 text-municipal-gray-500" />
                            <span className="text-xs font-semibold text-municipal-gray-500 uppercase">Flow Rate</span>
                        </div>
                        <div className="flex items-baseline gap-1">
                            <span className="text-3xl font-bold text-municipal-gray-900">{zone.flow || '--'}</span>
                            <span className="text-sm text-municipal-gray-500">L/min</span>
                        </div>
                        <div className="mt-1 text-xs text-municipal-gray-400">
                            Normal Range
                        </div>
                    </div>
                </div>

                {/* Chart */}
                <div>
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-semibold text-municipal-gray-700">24-Hour Pressure Trend</h3>
                        <Activity className="w-4 h-4 text-municipal-blue-500" />
                    </div>
                    <div className="h-40 w-full bg-white rounded-lg border border-municipal-gray-100 p-2">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={pressureTrend}>
                                <defs>
                                    <linearGradient id="colorPressure" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="time" hide />
                                <YAxis hide domain={['auto', 'auto']} />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#fff',
                                        borderRadius: '8px',
                                        border: '1px solid #e2e8f0',
                                        fontSize: '12px',
                                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                                    }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="value"
                                    stroke="#3b82f6"
                                    strokeWidth={2}
                                    fillOpacity={1}
                                    fill="url(#colorPressure)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-municipal-gray-200 bg-municipal-gray-50">
                <Link
                    to={`/zone/${zone.id}`}
                    className="flex items-center justify-center gap-2 w-full py-2.5 bg-white border border-municipal-gray-300 hover:bg-municipal-gray-100 text-municipal-gray-700 text-sm font-medium rounded-lg transition-colors shadow-sm"
                >
                    View Full Engineering Report <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
        </div>
    )
}

export default ZoneDetailsPanel
