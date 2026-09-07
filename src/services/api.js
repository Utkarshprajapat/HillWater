import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor for logging
apiClient.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`)
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
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
  // Zone endpoints
  getZones: () => apiClient.get('/zones'),
  getZone: (zoneId) => apiClient.get(`/zones/${zoneId}`),
  getZoneHistory: (zoneId, timeRange = '24h') => 
    apiClient.get(`/zones/${zoneId}/history`, { params: { range: timeRange } }),

  // System metrics
  getSystemMetrics: () => apiClient.get('/metrics'),
  getSystemHealth: () => apiClient.get('/health'),

  // Alerts
  getAlerts: (params = {}) => apiClient.get('/alerts', { params }),
  acknowledgeAlert: (alertId) => apiClient.post(`/alerts/${alertId}/acknowledge`),

  // Analytics
  getPressureAnalytics: (params = {}) => apiClient.get('/analytics/pressure', { params }),
  getConsumptionAnalytics: (params = {}) => apiClient.get('/analytics/consumption', { params }),
  getLeakDetection: () => apiClient.get('/analytics/leaks'),
}
