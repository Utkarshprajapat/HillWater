import { useState } from 'react'
import { Sliders, BellRing, Info } from 'lucide-react'

const AlertRules = () => {
    const [criticalPressure, setCriticalPressure] = useState(25)
    const [leakSensitivity, setLeakSensitivity] = useState(70)
    const [notifyTeams, setNotifyTeams] = useState(true)

    return (
        <div className="bg-white rounded-lg border border-municipal-gray-200 p-6 h-full">
            <h2 className="text-lg font-bold text-municipal-gray-900 mb-4 flex items-center gap-2">
                <Sliders className="w-5 h-5 text-municipal-blue-600" />
                Automation Rules
            </h2>

            <div className="space-y-6">
                {/* Rule 1 */}
                <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <label className="text-sm font-medium text-municipal-gray-700">Global Critical Pressure Limit</label>
                        <div className="px-2 py-0.5 bg-red-50 text-red-700 rounded text-xs font-bold border border-red-100">
                            &lt; {criticalPressure} PSI
                        </div>
                    </div>
                    <input
                        type="range" min="15" max="40"
                        value={criticalPressure}
                        onChange={(e) => setCriticalPressure(e.target.value)}
                        className="w-full h-2 bg-municipal-gray-200 rounded-lg appearance-none cursor-pointer accent-red-600"
                    />
                    <p className="text-xs text-municipal-gray-500 flex items-center gap-1">
                        <Info className="w-3 h-3" /> Alerts trigger immediately if any zone drops below this.
                    </p>
                </div>

                {/* Rule 2 */}
                <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <label className="text-sm font-medium text-municipal-gray-700">Leak Detection Sensitivity</label>
                        <div className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-xs font-bold border border-blue-100">
                            {leakSensitivity}%
                        </div>
                    </div>
                    <input
                        type="range" min="0" max="100"
                        value={leakSensitivity}
                        onChange={(e) => setLeakSensitivity(e.target.value)}
                        className="w-full h-2 bg-municipal-gray-200 rounded-lg appearance-none cursor-pointer accent-municipal-blue-600"
                    />
                    <p className="text-xs text-municipal-gray-500 flex items-center gap-1">
                        <Info className="w-3 h-3" /> Higher sensitivity may cause false positives.
                    </p>
                </div>

                {/* Toggle */}
                <div className="flex items-center justify-between pt-2 border-t border-municipal-gray-100">
                    <div className="flex items-center gap-2">
                        <BellRing className="w-4 h-4 text-municipal-gray-500" />
                        <span className="text-sm font-medium text-municipal-gray-700">Auto-Notify Field Teams</span>
                    </div>
                    <button
                        onClick={() => setNotifyTeams(!notifyTeams)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${notifyTeams ? 'bg-green-500' : 'bg-municipal-gray-300'}`}
                    >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${notifyTeams ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default AlertRules
