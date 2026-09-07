import { CheckCircle2, AlertTriangle, TrendingDown, BellRing, Info } from 'lucide-react'

const OperationalInsightsPanel = ({ zone }) => {
    // 1. GLOBAL VIEW (No Zone Selected)
    if (!zone) {
        return (
            <div className="h-full bg-white rounded-lg border border-municipal-gray-200 shadow-sm overflow-hidden flex flex-col">
                <div className="px-6 py-4 border-b border-municipal-gray-200 bg-municipal-gray-50">
                    <h2 className="text-xl font-bold text-municipal-gray-900">System Insights</h2>
                </div>
                <div className="p-6 flex-1 flex flex-col items-center justify-center text-center">
                    <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                        <Info className="w-6 h-6 text-blue-500" />
                    </div>
                    <h3 className="text-sm font-semibold text-municipal-gray-900 mb-1">
                        Select a Zone to View Insights
                    </h3>
                    <p className="text-xs text-municipal-gray-500 max-w-[200px]">
                        Click on any zone in the map to see specific operational suggestions and recent alerts.
                    </p>
                </div>
            </div>
        )
    }

    // 2. SELECTED ZONE VIEW
    const getOperationalAction = () => {
        if (zone.pressure < zone.minPressure) return {
            action: 'Open Booster Valve V-102 to 80%',
            reason: 'Pressure critically low during peak hours',
            type: 'critical'
        }
        if (zone.pressure > zone.maxPressure) return {
            action: 'Reduce Pump P-3 Speed by 10%',
            reason: 'Pressure exceeding safety thresholds',
            type: 'warning'
        }
        return {
            action: 'Maintain current setpoints',
            reason: 'Zone operating within optimal parameters',
            type: 'normal'
        }
    }

    const suggestion = getOperationalAction()

    // Style helpers for suggestion box
    const getSuggestionStyles = () => {
        switch (suggestion.type) {
            case 'critical': return 'bg-red-50 border-red-100 text-red-900'
            case 'warning': return 'bg-amber-50 border-amber-100 text-amber-900'
            default: return 'bg-green-50 border-green-100 text-green-900'
        }
    }

    return (
        <div className="h-full bg-white rounded-lg border border-municipal-gray-200 shadow-sm overflow-hidden flex flex-col animate-in slide-in-from-right-4 duration-300">
            <div className="px-6 py-4 border-b border-municipal-gray-200 bg-municipal-gray-50">
                <h2 className="text-xl font-bold text-municipal-gray-900">Operational Insights</h2>
            </div>

            <div className="p-6 space-y-6 overflow-y-auto flex-1">
                {/* Primary Recommendation */}
                <div>
                    <h3 className="text-xs font-bold uppercase text-municipal-gray-500 mb-3 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4" /> Recommended Action
                    </h3>
                    <div className={`p-4 rounded-lg border ${getSuggestionStyles()}`}>
                        <div className="font-semibold text-lg leading-tight mb-1">
                            {suggestion.action}
                        </div>
                        <div className="text-sm opacity-80">
                            Reason: {suggestion.reason}
                        </div>
                    </div>
                </div>

                {/* Secondary Metrics / Alerts */}
                <div>
                    <h3 className="text-xs font-bold uppercase text-municipal-gray-500 mb-3 flex items-center gap-2">
                        <BellRing className="w-4 h-4" /> Recent Events
                    </h3>
                    <div className="space-y-3">
                        {[1, 2].map((_, i) => (
                            <div key={i} className="flex gap-3 text-sm p-3 rounded bg-municipal-gray-50 border border-municipal-gray-100">
                                <div className="mt-0.5">
                                    <TrendingDown className="w-4 h-4 text-municipal-gray-400" />
                                </div>
                                <div>
                                    <p className="font-medium text-municipal-gray-900">Minor pressure fluctuation</p>
                                    <p className="text-xs text-municipal-gray-500 mt-0.5">Detected {i + 2} hours ago</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default OperationalInsightsPanel
