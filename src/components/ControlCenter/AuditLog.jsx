import { useState } from 'react'
import { FileText, Clock, User, ShieldCheck, Download } from 'lucide-react'

const AuditLog = ({ logs = [] }) => {
  const [filterType, setFilterType] = useState('ALL')

  const filteredLogs = logs.filter(log => {
    if (filterType === 'ALL') return true
    return log.type?.toLowerCase() === filterType.toLowerCase() ||
      log.action?.toLowerCase().includes(filterType.toLowerCase())
  })

  return (
    <div className="bg-slate-900 text-slate-200 rounded-xl p-5 shadow-sm flex flex-col h-full border border-slate-800">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-sky-400" />
          <h3 className="text-sm font-bold text-white tracking-wide">
            Operational Audit Trail
          </h3>
        </div>
        <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-2 py-0.5 rounded">
          IMMUTABLE LOGS
        </span>
      </div>

      {/* Log Feed */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-1 font-mono text-xs max-h-[460px]">
        {filteredLogs.length === 0 ? (
          <p className="text-slate-500 text-center py-6">No operational log entries recorded.</p>
        ) : (
          filteredLogs.map((log) => (
            <div
              key={log.id}
              className="bg-slate-800/60 p-2.5 rounded-lg border border-slate-800 hover:border-slate-700 transition-colors space-y-1"
            >
              <div className="flex items-center justify-between text-[10px] text-slate-400">
                <span className="flex items-center gap-1 text-sky-400 font-semibold">
                  <Clock className="w-3 h-3" />
                  {log.timestamp}
                </span>
                <span className="px-1.5 py-0.5 rounded bg-slate-700/80 text-slate-300 uppercase text-[9px] font-sans">
                  {log.zone || 'SYSTEM'}
                </span>
              </div>
              <p className="text-slate-200 font-sans text-xs leading-relaxed">
                {log.action}
              </p>
              <div className="flex items-center justify-between text-[10px] text-slate-500 pt-0.5">
                <span className="flex items-center gap-1">
                  <User className="w-2.5 h-2.5" />
                  {log.user || 'Operations Officer'}
                </span>
                <span className="text-slate-400">{log.type || 'System'}</span>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-500">
        <span>Logged in memory • Session Active</span>
        <span className="text-sky-400">HillWater v3.2</span>
      </div>
    </div>
  )
}

export default AuditLog
