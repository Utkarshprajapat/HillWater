/**
 * HILLWATER Data Context
 * Central State & Telemetry Provider
 * Nainital Demonstration Network
 */

import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react'
import { io } from 'socket.io-client'
import { apiService } from '../services/api'
import { generateMockZones, generateMockSystemMetrics, generateMockAlerts } from '../services/mockData'
import { getHierarchy, NAINITAL_DEMO_ZONES } from '../utils/hierarchy'
import { calculateZoneRisk } from '../utils/riskEngine'

const DataContext = createContext()

export const useData = () => {
  const context = useContext(DataContext)
  if (!context) {
    throw new Error('useData must be used within DataProvider')
  }
  return context
}

export const DataProvider = ({ children }) => {
  const [selectedTalukas] = useState(NAINITAL_DEMO_ZONES)

  // Tourist Surge Simulation State
  const [isSurgeActive, setIsSurgeActive] = useState(false)
  const [surgeMultiplier, setSurgeMultiplier] = useState(1.0)

  // Demo Scenario State (30-60 second guided flow)
  const [isDemoRunning, setIsDemoRunning] = useState(false)
  const [demoStep, setDemoStep] = useState(0)
  const [demoMessage, setDemoMessage] = useState('')

  // Core Data States
  const [zones, setZones] = useState(() => generateMockZones(null, false, 1.0))
  const [alerts, setAlerts] = useState(() => generateMockAlerts(generateMockZones(null, false, 1.0)))
  const [systemMetrics, setSystemMetrics] = useState(() => generateMockSystemMetrics(generateMockZones(null, false, 1.0)))
  const [isConnected, setIsConnected] = useState(false)
  const [lastUpdate, setLastUpdate] = useState(() => new Date())
  
  const [logs, setLogs] = useState([
    {
      id: 'log-init-1',
      action: 'HillWater Telemetry Engine initialized — Nainital Demonstration Network (12 Zones)',
      zone: 'SYSTEM',
      timestamp: new Date().toLocaleTimeString(),
      user: 'Network Operations Officer',
      type: 'System',
    }
  ])

  // Helper to add audit logs
  const addLog = useCallback((action, zone = 'SYSTEM', metadata = {}) => {
    const now = new Date()
    const timestamp = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })

    const newLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      action,
      zone,
      timestamp,
      user: metadata.user || 'Network Operations Officer',
      type: metadata.type || 'Operational',
      hierarchy: metadata.hierarchy || null,
      isAlertAck: metadata.isAlertAck || false,
    }
    setLogs(prev => [newLog, ...prev].slice(0, 100))
  }, [])

  // Recalculate whenever surge or demo mode updates
  const updateNetworkState = useCallback((surge = isSurgeActive, multiplier = surgeMultiplier) => {
    const updatedZones = generateMockZones(null, surge, multiplier)
    const updatedMetrics = generateMockSystemMetrics(updatedZones)
    const updatedAlerts = generateMockAlerts(updatedZones)

    setZones(updatedZones)
    setSystemMetrics(updatedMetrics)
    setAlerts(updatedAlerts)
    setLastUpdate(new Date())
  }, [isSurgeActive, surgeMultiplier])

  // Tourist Demand Surge Toggle
  const toggleTouristSurge = useCallback(() => {
    setIsSurgeActive(prev => {
      const next = !prev
      const nextMultiplier = next ? 1.45 : 1.0
      setSurgeMultiplier(nextMultiplier)
      
      const newZones = generateMockZones(null, next, nextMultiplier)
      setZones(newZones)
      setSystemMetrics(generateMockSystemMetrics(newZones))
      setAlerts(generateMockAlerts(newZones))
      setLastUpdate(new Date())

      addLog(
        next 
          ? 'SIMULATION STARTED: Tourist Demand Surge activated (+45% demand on Mallital, Mall Road, Bara Bazaar)'
          : 'SIMULATION STOPPED: Tourist Demand Surge deactivated. Returned to nominal baseline.',
        'SIMULATION',
        { type: 'Simulation' }
      )
      return next
    })
  }, [addLog])

  // Interactive What-If Simulation Apply Function
  const applyZoneIntervention = useCallback((zoneId, interventionType, magnitude) => {
    setZones(prevZones => {
      const updated = prevZones.map(z => {
        if (z.id === zoneId || z.name === zoneId) {
          const simulatedAnalysis = calculateZoneRisk({
            ...z,
            intervention: { type: interventionType, magnitude: Number(magnitude) }
          })
          return {
            ...z,
            pressure: simulatedAnalysis.effectivePressure,
            riskScore: simulatedAnalysis.riskScore,
            riskLevel: simulatedAnalysis.riskLevel,
            factors: simulatedAnalysis.factors,
            likelyCauses: simulatedAnalysis.likelyCauses,
            recommendation: simulatedAnalysis.recommendation,
          }
        }
        return z
      })
      setSystemMetrics(generateMockSystemMetrics(updated))
      return updated
    })

    addLog(`Simulated Intervention applied on ${zoneId}: ${interventionType} (${magnitude > 0 ? '+' : ''}${magnitude}%)`, zoneId, {
      type: 'Simulation'
    })
  }, [addLog])

  // Demo Scenario Runner (Deterministic 30-45s full product story)
  const demoIntervalRef = useRef(null)

  const stopDemoScenario = useCallback(() => {
    if (demoIntervalRef.current) {
      clearInterval(demoIntervalRef.current)
      demoIntervalRef.current = null
    }
    setIsDemoRunning(false)
    setDemoStep(0)
    setDemoMessage('')
    // Reset to normal
    setIsSurgeActive(false)
    setSurgeMultiplier(1.0)
    const normalZones = generateMockZones(null, false, 1.0)
    setZones(normalZones)
    setSystemMetrics(generateMockSystemMetrics(normalZones))
    setAlerts(generateMockAlerts(normalZones))
    addLog('Demo scenario stopped. Restored nominal operations.', 'DEMO')
  }, [addLog])

  const runDemoScenario = useCallback(() => {
    if (isDemoRunning) {
      stopDemoScenario()
      return
    }

    setIsDemoRunning(true)
    setDemoStep(1)
    setDemoMessage('Step 1: Morning tourist draw begins in upper elevation zones (Mallital 2,050m)...')
    addLog('Demo Scenario: Step 1 - Morning demand draw begins in Mallital', 'Mallital')

    let currentStep = 1

    demoIntervalRef.current = setInterval(() => {
      currentStep += 1
      setDemoStep(currentStep)

      if (currentStep === 2) {
        setDemoMessage('Step 2: Pressure starts falling in Mallital (2.2 bar → 1.8 bar). Flow demand exceeds supply.')
        setIsSurgeActive(true)
        setSurgeMultiplier(1.2)
        const step2Zones = generateMockZones(null, true, 1.2)
        setZones(step2Zones)
        setSystemMetrics(generateMockSystemMetrics(step2Zones))
        addLog('Demo Scenario: Step 2 - Pressure decline detected in Mallital (-0.28 bar/hr)', 'Mallital')
      } else if (currentStep === 3) {
        setDemoMessage('Step 3: Risk score increases to 68 (HIGH). Contributing factors: Demand (42%), Elevation Head (24%).')
        setSurgeMultiplier(1.38)
        const step3Zones = generateMockZones(null, true, 1.38)
        setZones(step3Zones)
        setSystemMetrics(generateMockSystemMetrics(step3Zones))
        setAlerts(generateMockAlerts(step3Zones))
        addLog('Demo Scenario: Step 3 - Risk Engine calculates HIGH risk in Mallital', 'Mallital')
      } else if (currentStep === 4) {
        setDemoMessage('Step 4: HillWater predicts potential supply failure in ~35 min. Automatic Critical Alert dispatched.')
        setSurgeMultiplier(1.5)
        const step4Zones = generateMockZones(null, true, 1.5)
        setZones(step4Zones)
        setSystemMetrics(generateMockSystemMetrics(step4Zones))
        setAlerts(generateMockAlerts(step4Zones))
        addLog('Demo Scenario: Step 4 - Critical Alert: Demand exceeding hydraulic capacity at 2,050m', 'Mallital')
      } else if (currentStep === 5) {
        setDemoMessage('Step 5: System recommends action: "Increase upstream booster pump output by +12%".')
        addLog('Demo Scenario: Step 5 - Recommendation generated: Booster Pump +12%', 'Mallital')
      } else if (currentStep === 6) {
        setDemoMessage('Step 6: Simulating recommended intervention in What-If Simulator...')
        // Apply intervention
        setZones(prev => prev.map(z => {
          if (z.id === 'MAL' || z.name === 'Mallital') {
            return {
              ...z,
              pressure: 2.3,
              riskScore: 32,
              riskLevel: 'LOW',
              likelyCauses: [{ cause: 'Pressure stabilized via booster pump adjustment', percentage: 100, detail: 'Pumping head increased by 12%.' }]
            }
          }
          return z
        }))
        addLog('Demo Scenario: Step 6 - Booster pump +12% applied. Pressure improved to 2.3 bar, Risk reduced to 32 (LOW).', 'Mallital')
      } else if (currentStep >= 7) {
        setDemoMessage('Scenario Complete! Service disruption successfully prevented through predictive intervention.')
        addLog('Demo Scenario Complete: Disruption prevented.', 'DEMO')
        clearInterval(demoIntervalRef.current)
        demoIntervalRef.current = null
        setTimeout(() => {
          setIsDemoRunning(false)
        }, 5000)
      }
    }, 5000)
  }, [isDemoRunning, stopDemoScenario, addLog])

  // Socket.IO for real-time integration (fallback to mock)
  useEffect(() => {
    let socket
    try {
      socket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:3001', {
        transports: ['websocket'],
        reconnection: true,
        reconnectionDelay: 1000,
        timeout: 5000,
        autoConnect: true,
      })

      socket.on('connect', () => {
        setIsConnected(true)
      })

      socket.on('disconnect', () => {
        setIsConnected(false)
      })

      socket.on('connect_error', () => {
        setIsConnected(false)
      })

      socket.on('zone:update', (data) => {
        setZones(prev => {
          const updated = [...prev]
          const index = updated.findIndex(z => z.id === data.id)
          if (index >= 0) {
            updated[index] = { ...updated[index], ...data }
          }
          return updated
        })
        setLastUpdate(new Date())
      })
    } catch {
      setIsConnected(false)
    }

    return () => {
      if (socket) socket.disconnect()
      if (demoIntervalRef.current) clearInterval(demoIntervalRef.current)
    }
  }, [])

  // Alert acknowledgment
  const acknowledgeAlert = async (alertId) => {
    try {
      const alertToAck = alerts.find(a => a.id === alertId)
      if (!alertToAck || alertToAck.acknowledged) return

      const now = new Date()
      const hierarchy = getHierarchy(alertToAck.zoneId || alertToAck.zoneName)

      setAlerts(prev =>
        prev.map(alert =>
          alert.id === alertId ? {
            ...alert,
            acknowledged: true,
            acknowledgedAt: now.toISOString(),
            acknowledgedBy: 'Water Operations Officer',
            status: 'Acknowledged',
          } : alert
        )
      )

      addLog(`Acknowledged Alert: ${alertToAck.title}`, alertToAck.zoneName || hierarchy.zoneName, {
        type: alertToAck.severity,
        hierarchy: hierarchy.fullPath,
        isAlertAck: true,
      })
    } catch (error) {
      console.error('Error acknowledging alert:', error)
    }
  }

  const value = {
    zones,
    alerts,
    systemMetrics,
    isConnected,
    lastUpdate,
    selectedTalukas,
    acknowledgeAlert,
    logs,
    addLog,
    isSurgeActive,
    surgeMultiplier,
    toggleTouristSurge,
    isDemoRunning,
    demoStep,
    demoMessage,
    runDemoScenario,
    stopDemoScenario,
    applyZoneIntervention,
    refreshData: () => updateNetworkState(),
  }

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}
