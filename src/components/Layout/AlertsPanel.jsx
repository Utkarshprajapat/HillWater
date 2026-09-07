import { useData } from '../../context/DataContext'
import { X, AlertTriangle, AlertCircle, Info, CheckCircle2 } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

const AlertsPanel = ({ isOpen, onClose }) => {
  const { alerts, acknowledgeAlert } = useData()

  const getAlertIcon = (severity) => {
    switch (severity) {
      case 'critical':
        return <AlertTriangle className="w-5 h-5 text-red-600" />
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-amber-600" />
      case 'info':
        return <Info className="w-5 h-5 text-blue-600" />
      default:
        return <Info className="w-5 h-5 text-municipal-gray-500" />
    }
  }

  const getAlertColor = (severity) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-50 border-red-200'
      case 'warning':
        return 'bg-amber-50 border-amber-200'
      case 'info':
        return 'bg-blue-50 border-blue-200'
      default:
        return 'bg-municipal-gray-50 border-municipal-gray-200'
    }
  }

  const handleAcknowledge = async (alertId) => {
    try {
      await acknowledgeAlert(alertId)
    } catch (error) {
      console.error('Error acknowledging alert:', error)
    }
  }

  if (!isOpen) return null

  return (
    <div className="w-96 bg-white border-l border-municipal-gray-200 flex flex-col shadow-xl">
      {/* Header */}
      <div className="p-4 border-b border-municipal-gray-200 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-municipal-gray-900">Alerts & Notifications</h2>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg hover:bg-municipal-gray-100 transition-colors"
          aria-label="Close alerts panel"
        >
          <X className="w-5 h-5 text-municipal-gray-600" />
        </button>
      </div>

      {/* Alerts List */}
      <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-3">
        {alerts.length === 0 ? (
          <div className="text-center py-8 text-municipal-gray-500">
            <CheckCircle2 className="w-12 h-12 mx-auto mb-2 text-green-500" />
            <p>No active alerts</p>
          </div>
        ) : (
          alerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-4 rounded-lg border ${getAlertColor(alert.severity)} ${
                !alert.acknowledged ? 'ring-2 ring-offset-2 ring-opacity-50' : ''
              }`}
            >
              <div className="flex items-start gap-3">
                {getAlertIcon(alert.severity)}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="font-medium text-municipal-gray-900 text-sm">
                      {alert.title}
                    </h3>
                    {!alert.acknowledged && (
                      <span className="px-2 py-0.5 bg-red-600 text-white text-xs rounded-full flex-shrink-0">
                        New
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-municipal-gray-600 mb-2">
                    {alert.message}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-municipal-gray-500">
                      {formatDistanceToNow(new Date(alert.timestamp), { addSuffix: true })}
                    </span>
                    {!alert.acknowledged && (
                      <button
                        onClick={() => handleAcknowledge(alert.id)}
                        className="text-xs text-municipal-blue-600 hover:text-municipal-blue-700 font-medium"
                      >
                        Acknowledge
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default AlertsPanel
