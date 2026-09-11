import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor for logging
apiClient.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
)

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error('API Error:', error.response?.data || error.message)
    return Promise.reject(error)
  }
)

export const apiService = {
  // Base endpoints
  getHealth: () => apiClient.get('/health'),
  getZones: () => apiClient.get('/zones'),
  getZone: (zoneId) => apiClient.get(`/zones/${zoneId}`),
  getZoneRisk: (zoneId) => apiClient.get(`/zones/${zoneId}/risk`),
  getRisks: () => apiClient.get('/risks'),
  
  // Alerts
  getAlerts: () => apiClient.get('/alerts'),
  getZoneAlerts: (zoneId) => apiClient.get(`/zones/${zoneId}/alerts`),
  acknowledgeAlert: (alertId) => apiClient.post(`/alerts/${alertId}/acknowledge`),

  // Simulator Controls
  getSimulatorStatus: () => apiClient.get('/simulator/status'),
  startSimulator: (zoneId, deviceId, scenario) => apiClient.post('/simulator/start', { zoneId, deviceId, scenario }),
  stopSimulator: () => apiClient.post('/simulator/stop'),
  setSimulatorScenario: (scenario) => apiClient.post('/simulator/scenario', { scenario }),

  // Zone Intervention (records a real intervention audit entry in the backend)
  interveneZone: (zoneId, { interventionType, action, setpoint, reason, operator } = {}) =>
    apiClient.post(`/zones/${zoneId}/intervene`, { interventionType, action, setpoint, reason, operator }),

  // Demo Reset (clears in-memory alerts + sensor history for a clean restart)
  resetDemo: () => apiClient.post('/demo/reset'),

  // History Endpoints
  getHistoricalReadings: (zoneId, timeRange = '24h') => apiClient.get(`/history/zones/${zoneId}/readings`, { params: { timeRange } }),
  getHistoricalRisk: (zoneId, timeRange = '24h') => apiClient.get(`/history/zones/${zoneId}/risk`, { params: { timeRange } }),
  getHistoricalAlerts: (zoneId, timeRange = '24h') => apiClient.get(`/history/zones/${zoneId}/alerts`, { params: { timeRange } }),

  // Old mock endpoints needed to avoid breaking other un-updated pages
  getSystemMetrics: () => ({ success: true, metrics: {} }),
  getZoneHistory: (zoneId, timeRange = '24h') => apiClient.get(`/zones/${zoneId}/history`, { params: { range: timeRange } }),
  getPressureAnalytics: () => ({ success: true, data: [] }),
  getConsumptionAnalytics: () => ({ success: true, data: [] }),
  getLeakDetection: () => ({ success: true, data: [] }),
}
