import { useData } from '../context/DataContext'
import CityOverviewPanel from '../components/Dashboard/CityOverviewPanel'
import HierarchyStatusView from '../components/Dashboard/HierarchyStatusView'
import AlertFeed from '../components/AlertFeed'
import PriorityZonesPanel from '../components/Dashboard/PriorityZonesPanel'
import AuditLog from '../components/ControlCenter/AuditLog'
import { Layers, Bell, Mountain } from 'lucide-react'

const Overview = () => {
  const { zones, logs } = useData()
  const activeZonesCount = zones.length
  const highRiskCount = zones.filter(z => z.riskScore >= 60).length

  return (
    <div className="space-y-8 pb-8">
      {/* SECTION 1: City Overview Panel - At-a-glance insights */}
      <CityOverviewPanel />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* SECTION 2: Priority Zones (Left Column - 1/3) */}
        <div className="lg:col-span-1">
          <PriorityZonesPanel />
        </div>

        {/* SECTION 3: Hierarchy Status View (Right Column - 2/3) */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Layers className="w-5 h-5 text-sky-600" />
                Topographic Network Topology
              </h2>
              <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider font-semibold">
                Nainital Demonstration Network • 12 Demonstration Sectors (1,500m–2,260m)
              </p>
            </div>
            <div className="px-3 py-1 bg-sky-50 text-sky-700 rounded-full text-[10px] font-bold uppercase border border-sky-100 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-600 animate-pulse"></span>
              Live Telemetry Simulation
            </div>
          </div>
          <HierarchyStatusView />
        </div>
      </div>

      {/* SECTION 4: Operations & Alerts Row - Side-by-side Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
        {/* Alerts Dashboard (Left) */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex flex-col h-[560px]">
          <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3 shrink-0">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Bell className="w-5 h-5 text-rose-600" />
              Dynamic Predictive Alerts Feed
            </h2>
            <div className="text-[11px] text-slate-500 font-medium">
              {highRiskCount > 0 ? `${highRiskCount} Critical / High Risks` : 'Nominal Stability'}
            </div>
          </div>
          <div className="flex-1 overflow-hidden">
            <AlertFeed />
          </div>
        </div>

        {/* Audit Log (Right) */}
        <div className="h-[560px]">
          <AuditLog logs={logs} />
        </div>
      </div>
    </div>
  )
}

export default Overview
