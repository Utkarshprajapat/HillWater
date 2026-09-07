import { useState } from 'react'
import LiveOperations from '../components/ControlCenter/LiveOperations'
import ZoneControls from '../components/ControlCenter/ZoneControls'
import SensorManager from '../components/ControlCenter/SensorManager'
import AlertRules from '../components/ControlCenter/AlertRules'
import AuditLog from '../components/ControlCenter/AuditLog'
import { useData } from '../context/DataContext'
import { Sliders, Mountain, ShieldCheck } from 'lucide-react'

const ControlCenter = () => {
    const { addLog, logs } = useData()

    const handleAction = (action, zone = 'SYSTEM') => {
        addLog(action, zone)
    }

    return (
        <div className="space-y-6 pb-12">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 text-[10px] font-bold bg-sky-100 text-sky-800 rounded uppercase tracking-wider">
                            Operations & Simulation Console
                        </span>
                        <span className="text-xs text-slate-400">• Nainital Demonstration Network</span>
                    </div>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                        HillWater Control Center
                    </h1>
                    <p className="text-xs text-slate-500 mt-0.5">
                        Municipal Water Operations • Sensor Fleet Diagnostics & Setpoint Modulation
                    </p>
                </div>

                <div className="px-3 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-mono font-bold flex items-center gap-2 shadow-sm">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>OPERATIONS LEVEL 3</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Operations & Controls */}
                <div className="space-y-6 flex flex-col">
                    <LiveOperations onAction={handleAction} />
                    <ZoneControls onAction={handleAction} />
                </div>

                {/* Center Column: Infrastructure & Rules */}
                <div className="space-y-6 flex flex-col">
                    <SensorManager onAction={handleAction} />
                    <AlertRules />
                </div>

                {/* Right Column: Audit Log */}
                <div className="h-[650px]">
                    <AuditLog logs={logs} />
                </div>
            </div>
        </div>
    )
}

export default ControlCenter
