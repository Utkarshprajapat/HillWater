import { useData } from '../../context/DataContext'
import { AlertTriangle, AlertCircle, Info, X, CheckCircle2 } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

const AlertsActionPanel = () => {
  const { alerts, acknowledgeAlert } = useData()

  const activeAlerts = alerts.filter(a => !a.acknowledged).slice(0, 5)

  const getAlertConfig = (severity) => {
    const configs = {
      critical: {
        icon: AlertTriangle,
        bg: 'bg-red-50',
        border: 'border-red-200',
        text: 'text-red-900',
        iconColor: 'text-red-600',
        label: 'Critical',
      },
      warning: {
        icon: AlertCircle,
        bg: 'bg-amber-50',
        border: 'border-amber-200',
        text: 'text-amber-900',
        iconColor: 'text-amber-600',
        label: 'Warning',
      },
      info: {
        icon: Info,
        bg: 'bg-blue-50',
        border: 'border-blue-200',
        text: 'text-blue-900',
        iconColor: 'text-blue-600',
        label: 'Info',
      },
    }
    return configs[severity] || configs.info
  }

  const handleAcknowledge = async (alertId) => {
    try {
      await acknowledgeAlert(alertId)
    } catch (error) {
      console.error('Error acknowledging alert:', error)
    }
  }

  return (
    <div className="bg-white rounded-lg border border-municipal-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-municipal-gray-900">
          Alerts & Actions
        </h2>
        {activeAlerts.length > 0 && (
          <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded">
            {activeAlerts.length} Active
          </span>
        )}
      </div>

      {activeAlerts.length === 0 ? (
        <div className="text-center py-8">
          <CheckCircle2 className="w-12 h-12 mx-auto mb-2 text-green-500" />
          <p className="text-sm text-municipal-gray-600">No active alerts</p>
          <p className="text-xs text-municipal-gray-500 mt-1">All systems operational</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-[400px] overflow-y-auto scrollbar-thin">
          {activeAlerts.map((alert) => {
            const config = getAlertConfig(alert.severity)
            const Icon = config.icon

            return (
              <div
                key={alert.id}
                className={`p-4 rounded-lg border ${config.bg} ${config.border}`}
              >
                <div className="flex items-start gap-3">
                  <Icon className={`w-5 h-5 ${config.iconColor} flex-shrink-0 mt-0.5`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div className="flex-1">
                        <h3 className={`font-semibold text-sm ${config.text} mb-1`}>
                          {alert.title}
                        </h3>
                        <p className="text-xs text-municipal-gray-700 leading-relaxed">
                          {alert.message}
                        </p>
                      </div>
                      <span
                        className={`px-2 py-0.5 rounded text-xs font-medium flex-shrink-0 ${config.border} ${config.text} bg-white`}
                      >
                        {config.label}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-xs text-municipal-gray-600">
                        {formatDistanceToNow(new Date(alert.timestamp), {
                          addSuffix: true,
                        })}
                      </span>
                      <button
                        onClick={() => handleAcknowledge(alert.id)}
                        className="px-3 py-1.5 bg-white border border-municipal-gray-300 rounded text-xs font-medium text-municipal-gray-700 hover:bg-municipal-gray-50 transition-colors"
                      >
                        Resolve
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default AlertsActionPanel
