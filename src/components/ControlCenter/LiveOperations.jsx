import { Activity, Play, Square, Settings } from 'lucide-react'
import { useState } from 'react'
import { useData } from '../../context/DataContext'
import { apiService } from '../../services/api'

const LiveOperations = ({ onAction }) => {
    const { simulatorStatus, isConnected, addLog } = useData()
    const [selectedScenario, setSelectedScenario] = useState('NORMAL')
    const [isLoading, setIsLoading] = useState(false)

    const handleStart = async () => {
        setIsLoading(true)
        try {
            await apiService.startSimulator('mallital', 'SIM-001', selectedScenario)
            addLog(`Simulator started with scenario: ${selectedScenario}`, 'SYSTEM')
            if (onAction) onAction('START_SIMULATOR', 'SYSTEM')
        } catch (error) {
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleStop = async () => {
        setIsLoading(true)
        try {
            await apiService.stopSimulator()
            addLog(`Simulator stopped`, 'SYSTEM')
            if (onAction) onAction('STOP_SIMULATOR', 'SYSTEM')
        } catch (error) {
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleScenarioChange = async (e) => {
        const scenario = e.target.value
        setSelectedScenario(scenario)
        if (simulatorStatus?.running) {
            setIsLoading(true)
            try {
                await apiService.setSimulatorScenario(scenario)
                addLog(`Scenario changed to: ${scenario}`, 'SYSTEM')
                if (onAction) onAction('CHANGE_SCENARIO', 'SYSTEM')
            } catch (error) {
                console.error(error)
            } finally {
                setIsLoading(false)
            }
        }
    }

    return (
        <div className="bg-white rounded-lg border border-slate-200 p-6">
            <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5 text-sky-600" />
                Telemetry Simulator Controls
            </h2>

            <div className="space-y-4">
                {/* System Status */}
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`}></div>
                        </div>
                        <span className="font-semibold text-slate-700">API Connection</span>
                    </div>
                    <span className={`text-sm font-mono font-bold ${isConnected ? 'text-emerald-700' : 'text-rose-700'}`}>
                        {isConnected ? 'ONLINE' : 'OFFLINE'}
                    </span>
                </div>

                {/* Simulator Status */}
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="flex items-center gap-3">
                        <Settings className="w-4 h-4 text-slate-500" />
                        <span className="font-semibold text-slate-700">Simulator Engine</span>
                    </div>
                    <span className={`text-sm font-mono font-bold ${simulatorStatus?.running ? 'text-sky-700' : 'text-slate-500'}`}>
                        {simulatorStatus?.running ? 'RUNNING' : 'STOPPED'}
                    </span>
                </div>

                <div className="pt-2 border-t border-slate-100">
                    <label className="block text-xs font-bold text-slate-500 mb-2 uppercase">Scenario Selection</label>
                    <select 
                        value={selectedScenario} 
                        onChange={handleScenarioChange}
                        disabled={isLoading}
                        className="w-full text-sm p-2 border border-slate-300 rounded focus:ring-sky-500 focus:border-sky-500"
                    >
                        <option value="NORMAL">Nominal Operations</option>
                        <option value="GRADUAL_DETERIORATION">Gradual Pressure Deterioration</option>
                        <option value="RAPID_PRESSURE_DETERIORATION">Rapid Pressure Deterioration</option>
                        <option value="SUPPLY_RESTRICTION">Upstream Supply Restriction</option>
                        <option value="POSSIBLE_DISTRIBUTION_LOSS">Possible Distribution Loss (Leak)</option>
                        <option value="RECOVERY">System Recovery</option>
                    </select>
                </div>

                <div className="flex gap-2 pt-2">
                    <button 
                        onClick={handleStart}
                        disabled={isLoading || simulatorStatus?.running}
                        className="flex-1 flex items-center justify-center gap-2 bg-sky-600 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded text-sm disabled:opacity-50"
                    >
                        <Play className="w-4 h-4" /> Start
                    </button>
                    <button 
                        onClick={handleStop}
                        disabled={isLoading || !simulatorStatus?.running}
                        className="flex-1 flex items-center justify-center gap-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold py-2 px-4 rounded text-sm disabled:opacity-50"
                    >
                        <Square className="w-4 h-4" /> Stop
                    </button>
                </div>
            </div>
        </div>
    )
}

export default LiveOperations
