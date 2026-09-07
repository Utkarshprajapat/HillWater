import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Map,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  Sliders,
  LogOut,
  User,
  Mountain,
  Activity,
  Layers
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const menuItems = [
  { path: '/overview', icon: LayoutDashboard, label: 'Overview', roles: ['admin', 'viewer'] },
  { path: '/zones', icon: Map, label: 'Terrain Zone Map', roles: ['admin', 'viewer'] },
  { path: '/analytics', icon: BarChart3, label: 'Predictive Analytics', roles: ['admin', 'viewer'] },
  { path: '/admin', icon: Sliders, label: 'Control Center', roles: ['admin'] },
]

const Sidebar = ({ isOpen, onToggle }) => {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <aside
      className={`${
        isOpen ? 'w-64' : 'w-20'
      } bg-slate-900 text-slate-300 transition-all duration-300 flex flex-col shadow-xl z-20 border-r border-slate-800`}
    >
      {/* 1. Header (Brand + Toggle) */}
      <div className={`h-16 px-4 border-b border-slate-800 flex items-center ${isOpen ? 'justify-between' : 'justify-center'}`}>
        {isOpen ? (
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 bg-sky-500 rounded-lg flex items-center justify-center font-bold text-white shadow-sm">
              <Mountain size={18} />
            </div>
            <div>
              <span className="text-sm font-extrabold tracking-tight text-white block leading-none">
                HILL<span className="text-sky-400">WATER</span>
              </span>
              <span className="text-[9px] font-bold text-sky-300 uppercase tracking-widest block mt-0.5">
                Nainital Network
              </span>
            </div>
          </div>
        ) : (
          <div className="h-8 w-8 bg-sky-500 rounded-lg flex items-center justify-center text-white">
            <Mountain size={18} />
          </div>
        )}

        <button
          onClick={onToggle}
          className={`p-1.5 rounded-lg transition-all duration-200 border border-transparent ${
            !isOpen 
              ? 'bg-slate-800 text-sky-400 hover:bg-slate-700' 
              : 'hover:bg-slate-800 text-slate-400 hover:text-slate-200'
          }`}
          title={isOpen ? "Collapse Sidebar" : "Expand Sidebar"}
        >
          {isOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
        </button>
      </div>

      {/* 2. User Profile */}
      <div className={`px-4 py-3.5 border-b border-slate-800 ${!isOpen && 'flex justify-center'}`}>
        {isOpen ? (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-sky-400">
              <User size={15} />
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-semibold text-white truncate">{user?.name || 'Operations Officer'}</p>
              <p className="text-[9px] text-sky-400 uppercase font-bold tracking-wider">Water Operations</p>
            </div>
          </div>
        ) : (
          <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400" title={user?.name}>
            <User size={15} />
          </div>
        )}
      </div>

      {/* 3. Navigation */}
      <nav className="flex-1 p-3 space-y-1.5 overflow-y-auto">
        {menuItems.filter(item => item.roles.includes(user?.role || 'viewer')).map((item) => {
          const Icon = item.icon
          const isActive = location.pathname === item.path

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative ${
                isActive
                  ? 'bg-sky-600 text-white font-semibold shadow-md shadow-sky-900/30'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              } ${!isOpen && 'justify-center px-2'}`}
              title={!isOpen ? item.label : ''}
            >
              <Icon
                size={18}
                className={`flex-shrink-0 transition-colors ${
                  isActive ? 'text-white' : 'text-slate-400 group-hover:text-sky-400'
                }`}
              />

              {isOpen && <span className="text-xs font-medium">{item.label}</span>}
            </Link>
          )
        })}
      </nav>

      {/* 4. Altitude Summary & System Status */}
      {isOpen && (
        <div className="p-3 mx-3 mb-2 bg-slate-800/80 rounded-xl border border-slate-700 text-xs">
          <div className="flex items-center justify-between text-[11px] mb-1">
            <span className="text-slate-400">Network Altitude:</span>
            <span className="text-sky-300 font-mono font-bold">1500–2260m</span>
          </div>
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-400">Demo Zones:</span>
            <span className="text-emerald-400 font-bold">12 Monitored</span>
          </div>
        </div>
      )}

      {/* 5. Bottom Logout */}
      <div className="p-3 border-t border-slate-800 space-y-1">
        <button
          onClick={handleLogout}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-slate-400 hover:bg-rose-950/40 hover:text-rose-400 transition-colors group ${!isOpen && 'justify-center'}`}
          title="Logout"
        >
          <LogOut size={16} className="flex-shrink-0 group-hover:text-rose-400 transition-colors" />
          {isOpen && <span className="text-xs font-medium">Exit Console</span>}
        </button>
      </div>
    </aside>
  )
}

export default Sidebar
