/**
 * HILLWATER Mock Data Generator
 * "Predictive Water-Service Reliability for Hill Towns"
 * Nainital Demonstration Network
 * 
 * Simulated Demo Data - Not live sensor data
 */

import { NAINITAL_ZONES_CONFIG, calculateZoneRisk } from '../utils/riskEngine'

export const generateMockZones = (selectedZonesList = null, surgeActive = false, surgeMultiplier = 1.0) => {
  const configs = selectedZonesList && selectedZonesList.length > 0
    ? NAINITAL_ZONES_CONFIG.filter(z => selectedZonesList.includes(z.name) || selectedZonesList.includes(z.id))
    : NAINITAL_ZONES_CONFIG

  return configs.map(config => {
    // Determine dynamic demand and pressure based on tourist surge state
    let demand = config.baseDemand
    let pressure = config.targetPressure
    let pressureTrend = 0.0
    let flow = config.baseFlow
    let tankLevel = 78

    if (surgeActive && config.isTouristZone) {
      // Tourist surge stresses Mallital, Mall Road, Bara Bazaar
      const surgeFactor = surgeMultiplier || 1.35
      demand = Math.round(config.baseDemand * surgeFactor)
      
      // Hydraulic head loss due to demand surge & high elevation head resistance
      const elevPenalty = ((config.elevation - 1500) / 760) * 0.35 // Higher elevation drops faster
      pressure = Number(Math.max(1.1, config.targetPressure - (0.65 * (surgeFactor - 1) * 2.5 + elevPenalty)).toFixed(1))
      pressureTrend = -Number((0.35 * surgeFactor).toFixed(2)) // negative trend
      tankLevel = Math.max(28, Math.round(78 - (surgeFactor - 1) * 90))
      flow = Math.round(config.baseFlow * 1.08) // slightly higher flow but insufficient pressure
    } else {
      // Normal baseline variation
      // Higher elevation natural lower baseline pressure
      const elevBaselineMod = ((2260 - config.elevation) / 760) * 0.4
      pressure = Number((config.targetPressure - 0.1 + elevBaselineMod * 0.15).toFixed(1))
      pressureTrend = -0.02
      tankLevel = 76 + (config.elevation % 10)
    }

    const zoneRawData = {
      id: config.id,
      name: config.name,
      area: `${config.name} Sector 1`,
      elevation: config.elevation,
      terrain: config.terrain,
      pressure,
      minPressure: config.minPressure,
      maxPressure: config.maxPressure,
      targetPressure: config.targetPressure,
      pressureTrend,
      flow,
      baseFlow: config.baseFlow,
      demand,
      baseDemand: config.baseDemand,
      tankLevel,
      tankCapacity: config.tankCapacity,
      lat: config.lat,
      lng: config.lng,
      isTouristZone: config.isTouristZone,
      status: 'active',
      lastUpdated: new Date().toISOString(),
      sensors: [
        { id: `P-${config.id}-01`, type: 'Pressure', value: `${pressure} bar`, status: pressure < config.minPressure ? 'WARNING' : 'ONLINE' },
        { id: `F-${config.id}-01`, type: 'Flow Meter', value: `${flow} L/m`, status: 'ONLINE' },
        { id: `L-${config.id}-01`, type: 'Tank Level', value: `${tankLevel}%`, status: tankLevel < 40 ? 'WARNING' : 'ONLINE' },
      ]
    }

    // Attach calculated risk
    const riskAnalysis = calculateZoneRisk(zoneRawData)

    return {
      ...zoneRawData,
      riskScore: riskAnalysis.riskScore,
      riskLevel: riskAnalysis.riskLevel,
      factors: riskAnalysis.factors,
      rawScores: riskAnalysis.rawScores,
      likelyCauses: riskAnalysis.likelyCauses,
      predictedIssue: riskAnalysis.predictedIssue,
      estimatedTimeHorizon: riskAnalysis.estimatedTimeHorizon,
      recommendation: riskAnalysis.recommendation,
    }
  })
}

export const generateMockSystemMetrics = (zones = []) => {
  const zoneList = zones.length > 0 ? zones : generateMockZones()
  
  // Calculate system-level Network Health Score (0-100) dynamically from zone risks
  const avgRisk = zoneList.reduce((acc, z) => acc + (z.riskScore || 0), 0) / (zoneList.length || 1)
  const healthScore = Math.max(10, Math.min(99, Math.round(100 - avgRisk * 0.85)))
  
  const highRiskCount = zoneList.filter(z => z.riskLevel === 'HIGH' || z.riskLevel === 'CRITICAL').length
  const warningCount = zoneList.filter(z => z.riskLevel === 'MEDIUM').length
  const totalFlow = zoneList.reduce((acc, z) => acc + (z.flow || 0), 0)
  const totalDemand = zoneList.reduce((acc, z) => acc + (z.demand || 0), 0)
  const avgPressure = Number((zoneList.reduce((acc, z) => acc + (z.pressure || 0), 0) / zoneList.length).toFixed(1))

  return {
    health: healthScore,
    healthTrend: highRiskCount > 0 ? '-3.5%' : '+1.2%',
    pressureStability: Math.max(40, Math.round(100 - avgRisk * 0.7)),
    flowConsistency: Math.round(92 - (totalDemand > totalFlow ? 15 : 0)),
    tankAvailability: Math.round(zoneList.reduce((acc, z) => acc + (z.tankLevel || 75), 0) / zoneList.length),
    totalZones: zoneList.length,
    activeZones: zoneList.length,
    highRiskZones: highRiskCount,
    warningZones: warningCount,
    totalFlow,
    totalDemand,
    avgPressure,
    elevationRange: '1,500m – 2,260m',
    lastUpdated: new Date().toISOString(),
  }
}

export const generateMockAlerts = (zones = []) => {
  const zoneList = zones.length > 0 ? zones : generateMockZones()
  const alerts = []

  zoneList.forEach((zone, idx) => {
    if (zone.riskScore >= 70) {
      alerts.push({
        id: `alert-crit-${zone.id}-${Date.now()}`,
        zoneId: zone.id,
        zoneName: zone.name,
        elevation: zone.elevation,
        severity: 'critical',
        title: `High Risk - Pressure Failure Warning (${zone.name})`,
        message: `Demand (${zone.demand} L/m) is stressing hydraulic head at ${zone.elevation}m altitude. Pressure dropped to ${zone.pressure} bar.`,
        reason: zone.likelyCauses && zone.likelyCauses[0] ? zone.likelyCauses[0].detail : 'Hydraulic gradient stress exceeds safe threshold',
        recommendedAction: zone.recommendation ? zone.recommendation.action : 'Increase upstream pump pressure',
        timestamp: new Date(Date.now() - (idx * 180000 + 120000)).toISOString(),
        acknowledged: false,
        riskScore: zone.riskScore,
        factors: zone.factors,
      })
    } else if (zone.riskScore >= 45) {
      alerts.push({
        id: `alert-warn-${zone.id}-${Date.now()}`,
        zoneId: zone.id,
        zoneName: zone.name,
        elevation: zone.elevation,
        severity: 'warning',
        title: `Pressure Gradient Drift (${zone.name})`,
        message: `Pressure trending below nominal target at ${zone.pressure} bar. Tank level at ${zone.tankLevel}%.`,
        reason: `High elevation head constraint (${zone.elevation}m) causing marginal delivery latency.`,
        recommendedAction: zone.recommendation ? zone.recommendation.action : 'Inspect pressure control valve setpoint',
        timestamp: new Date(Date.now() - (idx * 240000 + 360000)).toISOString(),
        acknowledged: false,
        riskScore: zone.riskScore,
        factors: zone.factors,
      })
    }
  })

  // Ensure at least 2 baseline demonstration alerts if all zones are healthy
  if (alerts.length === 0) {
    const highElevZone = zoneList.find(z => z.id === 'AYA') || zoneList[0]
    alerts.push({
      id: `alert-demo-1`,
      zoneId: highElevZone.id,
      zoneName: highElevZone.name,
      elevation: highElevZone.elevation,
      severity: 'warning',
      title: `Terrain Head Constraint (${highElevZone.name})`,
      message: `Elevation ${highElevZone.elevation}m requires active booster calibration during morning draw.`,
      reason: 'Steep topographic gradient increases pressure loss under moderate flow.',
      recommendedAction: 'Verify booster pump P-AYA-01 telemetry and valve V-102 setpoint.',
      timestamp: new Date(Date.now() - 900000).toISOString(),
      acknowledged: true,
      riskScore: 48,
    })
  }

  return alerts.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
}

export const initializeMockData = () => {
  const zones = generateMockZones()
  return {
    zones,
    systemMetrics: generateMockSystemMetrics(zones),
    alerts: generateMockAlerts(zones),
  }
}
