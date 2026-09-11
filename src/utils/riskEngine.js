/**
 * HILLWATER RISK & HYDRAULIC ENGINE
 * "Predictive Water-Service Reliability for Hill Towns"
 * 
 * Flow:
 * Elevation + Pressure + Flow + Tank Level + Demand
 *  -> Zone Risk (0-100) & Level (LOW/MEDIUM/HIGH/CRITICAL)
 *  -> Calculated Contributing Factors (%)
 *  -> Likely Root Causes
 *  -> Prediction & Horizon
 *  -> Dynamic Intervention Recommendation
 * 
 * Note: Transparent, deterministic, rule-based hydraulic scoring model for prototype demonstration.
 */

// Canonical 12 Nainital Demonstration Zones with Elevations and Baseline Parameters
export const NAINITAL_ZONES_CONFIG = [
  {
    id: 'MAL',
    name: 'Mallital',
    elevation: 2050, // meters
    terrain: 'Upper Basin / Tourist Hub',
    targetPressure: 2.2, // bar (approx 32 PSI)
    minPressure: 1.5,
    maxPressure: 3.5,
    baseFlow: 1450, // L/min
    baseDemand: 1380, // L/min
    tankCapacity: 250, // kL
    lat: 29.3975,
    lng: 79.4520,
    isTouristZone: true,
  },
  {
    id: 'TAL',
    name: 'Tallital',
    elevation: 1980,
    terrain: 'Lake Outlet / Lower Commercial',
    targetPressure: 2.4,
    minPressure: 1.6,
    maxPressure: 3.8,
    baseFlow: 1350,
    baseDemand: 1280,
    tankCapacity: 220,
    lat: 29.3830,
    lng: 79.4630,
    isTouristZone: false,
  },
  {
    id: 'SUK',
    name: 'Sukhatal',
    elevation: 2100,
    terrain: 'High Catchment / Recharge Basin',
    targetPressure: 2.1,
    minPressure: 1.4,
    maxPressure: 3.2,
    baseFlow: 1100,
    baseDemand: 1050,
    tankCapacity: 180,
    lat: 29.3990,
    lng: 79.4440,
    isTouristZone: false,
  },
  {
    id: 'AYA',
    name: 'Ayarpatta',
    elevation: 2260, // Highest zone
    terrain: 'High Ridge / Steep Elevation',
    targetPressure: 1.9,
    minPressure: 1.3,
    maxPressure: 3.0,
    baseFlow: 850,
    baseDemand: 820,
    tankCapacity: 150,
    lat: 29.3820,
    lng: 79.4480,
    isTouristZone: false,
  },
  {
    id: 'SKD',
    name: 'Sher Ka Danda',
    elevation: 2200,
    terrain: 'Northern Ridge Crest',
    targetPressure: 2.0,
    minPressure: 1.3,
    maxPressure: 3.1,
    baseFlow: 920,
    baseDemand: 890,
    tankCapacity: 160,
    lat: 29.3960,
    lng: 79.4670,
    isTouristZone: false,
  },
  {
    id: 'BBZ',
    name: 'Bara Bazaar',
    elevation: 2000,
    terrain: 'Dense Heritage Market',
    targetPressure: 2.3,
    minPressure: 1.5,
    maxPressure: 3.6,
    baseFlow: 1250,
    baseDemand: 1200,
    tankCapacity: 200,
    lat: 29.3920,
    lng: 79.4580,
    isTouristZone: true,
  },
  {
    id: 'MLR',
    name: 'Mall Road',
    elevation: 1950,
    terrain: 'Lakeside Commercial Promenade',
    targetPressure: 2.5,
    minPressure: 1.7,
    maxPressure: 4.0,
    baseFlow: 1550,
    baseDemand: 1480,
    tankCapacity: 280,
    lat: 29.3890,
    lng: 79.4590,
    isTouristZone: true,
  },
  {
    id: 'BHP',
    name: 'Bhotia Parao',
    elevation: 1600,
    terrain: 'Mid-Slope Transit Node',
    targetPressure: 2.8,
    minPressure: 1.9,
    maxPressure: 4.2,
    baseFlow: 1150,
    baseDemand: 1080,
    tankCapacity: 190,
    lat: 29.3750,
    lng: 79.4750,
    isTouristZone: false,
  },
  {
    id: 'HSP',
    name: 'Hospital Road',
    elevation: 2020,
    terrain: 'Critical Institutional Sector',
    targetPressure: 2.3,
    minPressure: 1.6,
    maxPressure: 3.6,
    baseFlow: 1050,
    baseDemand: 980,
    tankCapacity: 210,
    lat: 29.3940,
    lng: 79.4510,
    isTouristZone: false,
  },
  {
    id: 'TBM',
    name: 'Talli Bamouri',
    elevation: 1500, // Lowest zone
    terrain: 'Valley Base / Feeder Node',
    targetPressure: 3.1,
    minPressure: 2.1,
    maxPressure: 4.6,
    baseFlow: 1600,
    baseDemand: 1500,
    tankCapacity: 300,
    lat: 29.3620,
    lng: 79.4880,
    isTouristZone: false,
  },
  {
    id: 'CKM',
    name: 'Chhoti Kaimalta',
    elevation: 1750,
    terrain: 'Eastern Hill Flank',
    targetPressure: 2.6,
    minPressure: 1.8,
    maxPressure: 4.0,
    baseFlow: 980,
    baseDemand: 920,
    tankCapacity: 170,
    lat: 29.3850,
    lng: 79.4780,
    isTouristZone: false,
  },
  {
    id: 'RTG',
    name: 'Ratighat',
    elevation: 1550,
    terrain: 'River Confluence / Gravity Outflow',
    targetPressure: 3.0,
    minPressure: 2.0,
    maxPressure: 4.5,
    baseFlow: 1200,
    baseDemand: 1120,
    tankCapacity: 230,
    lat: 29.4120,
    lng: 79.4950,
    isTouristZone: false,
  },
]

/**
 * Calculates Explainable Zone Risk based on real hydraulic and terrain inputs
 */
export const calculateZoneRisk = (zoneData = {}) => {
  const {
    elevation = 1950,
    pressure = 2.2,
    minPressure = 1.6,
    targetPressure = 2.5,
    pressureTrend = 0, // negative means falling
    flow = 1200,
    baseFlow = 1200,
    tankLevel = 75, // percentage
    demand = 1200,
    baseDemand = 1200,
    intervention = null, // { type: 'increase_pump'|'open_valve'|'shift_supply'|'reduce_demand'|'restore_tank', magnitude: number }
  } = zoneData

  // 1. Elevation Constraint Factor (0 - 25 points)
  // Higher elevation requires higher head, more pumping energy, steeper gravity gradient loss
  // Range 1500m (0 pts) to 2260m (25 pts)
  const elevNorm = Math.max(0, Math.min(1, (elevation - 1500) / (2260 - 1500)))
  const elevationStressScore = elevNorm * 22

  // 2. Pressure Stress Factor (0 - 35 points)
  // Evaluates deficit from target and proximity to min threshold
  let effectivePressure = Number(pressure) || 0
  if (intervention) {
    if (intervention.type === 'increase_pump') {
      effectivePressure += (intervention.magnitude / 100) * 0.9
    } else if (intervention.type === 'open_valve') {
      effectivePressure += (intervention.magnitude / 100) * 0.6
    } else if (intervention.type === 'shift_supply') {
      effectivePressure += (intervention.magnitude / 100) * 0.5
    } else if (intervention.type === 'reduce_demand') {
      effectivePressure += (intervention.magnitude / 100) * 0.4
    }
  }

  let pressureDeficit = 0
  if (effectivePressure < targetPressure) {
    pressureDeficit = (targetPressure - effectivePressure) / (targetPressure - minPressure + 0.2)
  }
  // Elevation amplifies pressure deficit impact
  const elevationAmplifier = 1 + (elevNorm * 0.4) // up to 40% more sensitive
  const pressureStressScore = Math.max(0, Math.min(35, pressureDeficit * 30 * elevationAmplifier))

  // 3. Pressure Trend Factor (0 - 20 points)
  // Rapid drop indicates pipe rupture, sudden demand surge, or pump trip
  let trendStressScore = 0
  if (pressureTrend < 0) {
    const trendDrop = Math.abs(pressureTrend) // e.g. 0.1 to 0.8 bar/hr drop
    trendStressScore = Math.min(20, (trendDrop / 0.5) * 18)
  }

  // 4. Demand / Supply Imbalance (0 - 25 points)
  let effectiveDemand = demand
  if (intervention && intervention.type === 'reduce_demand') {
    effectiveDemand = Math.max(baseDemand * 0.7, effectiveDemand * (1 - intervention.magnitude / 100))
  }
  const demandSupplyRatio = effectiveDemand / (flow > 0 ? flow : baseFlow)
  let demandStressScore = 0
  if (demandSupplyRatio > 1.0) {
    demandStressScore = Math.min(25, (demandSupplyRatio - 1.0) * 45)
  }

  // 5. Tank Level Stress (0 - 15 points)
  let effectiveTank = tankLevel
  if (intervention && intervention.type === 'restore_tank') {
    effectiveTank = Math.min(100, effectiveTank + intervention.magnitude)
  }
  let tankStressScore = 0
  if (effectiveTank < 50) {
    tankStressScore = ((50 - effectiveTank) / 50) * 15
  }

  // 6. Flow Anomaly Factor (0 - 15 points)
  // Abnormally high flow with low pressure = leak; abnormally low flow = blockage/head deficit
  let flowAnomalyScore = 0
  const flowRatio = flow / (baseFlow || 1)
  if (flowRatio < 0.75) {
    flowAnomalyScore = ((0.75 - flowRatio) / 0.75) * 12
  } else if (flowRatio > 1.35 && effectivePressure < targetPressure) {
    flowAnomalyScore = Math.min(15, (flowRatio - 1.35) * 20)
  }

  // Raw combined score (max potential ~ 130, normalize strictly to 0 - 100)
  const rawSum = elevationStressScore + pressureStressScore + trendStressScore + demandStressScore + tankStressScore + flowAnomalyScore
  const riskScore = Math.max(0, Math.min(100, Math.round((rawSum / 125) * 100)))

  // Risk Level Category
  let riskLevel = 'LOW'
  if (riskScore >= 80) riskLevel = 'CRITICAL'
  else if (riskScore >= 60) riskLevel = 'HIGH'
  else if (riskScore >= 35) riskLevel = 'MEDIUM'

  // Dynamic Calculated Contributing Factors
  const totalDriverWeight = (demandStressScore + 0.1) + (trendStressScore + 0.1) + (pressureStressScore + 0.1) + (elevationStressScore + 0.1) + (tankStressScore + 0.1) + (flowAnomalyScore + 0.1)

  const factorDemand = Math.round(((demandStressScore + 0.1) / totalDriverWeight) * 100)
  const factorTrend = Math.round(((trendStressScore + 0.1) / totalDriverWeight) * 100)
  const factorPressure = Math.round(((pressureStressScore + 0.1) / totalDriverWeight) * 100)
  const factorElevation = Math.round(((elevationStressScore + 0.1) / totalDriverWeight) * 100)
  const factorTank = Math.round(((tankStressScore + 0.1) / totalDriverWeight) * 100)
  const factorFlow = Math.max(0, 100 - (factorDemand + factorTrend + factorPressure + factorElevation + factorTank))

  // Root Cause Explanation (Dynamic reasoning)
  const likelyCauses = []
  if (demandStressScore > 8) {
    likelyCauses.push({
      cause: 'Tourist / Peak Demand Surge',
      percentage: factorDemand,
      detail: `Demand (${Math.round(effectiveDemand)} L/m) is ${Math.round(((effectiveDemand / baseDemand) - 1) * 100)}% above normal baseline.`
    })
  }
  if (effectiveTank < 45) {
    likelyCauses.push({
      cause: 'Depleted Feeder Tank Storage',
      percentage: factorTank,
      detail: `Zone storage tank is at ${Math.round(effectiveTank)}% capacity (below 50% buffer).`
    })
  }
  if (trendStressScore > 5) {
    likelyCauses.push({
      cause: 'Accelerating Pressure Gradient Decline',
      percentage: factorTrend,
      detail: `Hydraulic pressure falling continuously at ${(Math.abs(pressureTrend) || 0.35).toFixed(2)} bar/hr.`
    })
  }
  if (elevationStressScore > 10) {
    likelyCauses.push({
      cause: 'High Elevation Pumping Head Constraint',
      percentage: factorElevation,
      detail: `Altitude (${elevation}m) increases gravity head resistance and pressure sensitivity.`
    })
  }
  if (flowAnomalyScore > 5) {
    likelyCauses.push({
      cause: 'Supply Line Bottleneck / Leakage',
      percentage: factorFlow,
      detail: flowRatio > 1.2 ? 'Elevated flow with declining pressure indicates potential pipeline rupture.' : 'Flow restricted below feeder baseline.'
    })
  }

  if (likelyCauses.length === 0) {
    likelyCauses.push({
      cause: 'Nominal Hydraulic Operations',
      percentage: 100,
      detail: 'Pressure, flow, and tank storage are balanced across the terrain profile.'
    })
  }

  // Predicted Issue & Time Horizon
  let predictedIssue = 'Network operates stably within target safety margins'
  let estimatedTimeHorizon = 'Stable (> 6 hrs)'

  if (riskScore >= 80) {
    predictedIssue = 'Imminent supply cavitation & tail-end pressure collapse'
    estimatedTimeHorizon = '~15–25 min'
  } else if (riskScore >= 60) {
    predictedIssue = 'Pressure boundary breach expected under sustained demand'
    estimatedTimeHorizon = '~35–45 min'
  } else if (riskScore >= 35) {
    predictedIssue = 'Marginal pressure drift in elevated sub-sectors'
    estimatedTimeHorizon = '~90–120 min'
  }

  // Recommended Action & Dynamic Simulated Outcome
  let recommendedActionText = 'Maintain current pump and valve setpoints.'
  let recommendedInterventionType = 'increase_pump'
  let recommendedMagnitude = 8
  let expectedPressure = Number((effectivePressure + 0.5).toFixed(1))
  let expectedRisk = Math.max(15, riskScore - 38)

  if (demandStressScore > 12 && elevation > 1900) {
    recommendedActionText = `Increase upstream booster pump output by 12% to overcome ${elevation}m elevation head.`
    recommendedInterventionType = 'increase_pump'
    recommendedMagnitude = 12
    expectedPressure = Number((effectivePressure + 0.65).toFixed(1))
    expectedRisk = Math.max(20, Math.round(riskScore * 0.45))
  } else if (effectiveTank < 40) {
    recommendedActionText = 'Initiate gravity transfer from Sukhatal / Talli Bamouri feeder lines to restore buffer.'
    recommendedInterventionType = 'restore_tank'
    recommendedMagnitude = 25
    expectedPressure = Number((effectivePressure + 0.4).toFixed(1))
    expectedRisk = Math.max(22, Math.round(riskScore * 0.5))
  } else if (pressureDeficit > 0.4) {
    recommendedActionText = 'Modulate inlet pressure control valve by +10% to stabilize tail-end gradient.'
    recommendedInterventionType = 'open_valve'
    recommendedMagnitude = 10
    expectedPressure = Number((effectivePressure + 0.5).toFixed(1))
    expectedRisk = Math.max(25, Math.round(riskScore * 0.52))
  } else if (riskScore >= 60) {
    recommendedActionText = 'Shift supplementary supply from adjacent low-demand valley sector.'
    recommendedInterventionType = 'shift_supply'
    recommendedMagnitude = 15
    expectedPressure = Number((effectivePressure + 0.55).toFixed(1))
    expectedRisk = Math.max(20, Math.round(riskScore * 0.48))
  }

  return {
    riskScore,
    riskLevel,
    effectivePressure: Number(effectivePressure.toFixed(1)),
    factors: {
      demandSupplyDeficit: factorDemand,
      pressureTrend: factorTrend,
      pressureStress: factorPressure,
      elevationConstraint: factorElevation,
      tankLevel: factorTank,
      flowAnomaly: factorFlow,
    },
    rawScores: {
      elevationStress: Number(elevationStressScore.toFixed(1)),
      pressureStress: Number(pressureStressScore.toFixed(1)),
      trendStress: Number(trendStressScore.toFixed(1)),
      demandStress: Number(demandStressScore.toFixed(1)),
      tankStress: Number(tankStressScore.toFixed(1)),
      flowAnomaly: Number(flowAnomalyScore.toFixed(1)),
    },
    likelyCauses,
    predictedIssue,
    estimatedTimeHorizon,
    recommendation: {
      action: recommendedActionText,
      type: recommendedInterventionType,
      magnitude: recommendedMagnitude,
      currentPressure: Number(effectivePressure.toFixed(1)),
      currentRisk: riskScore,
      expectedPressure,
      expectedRisk,
    }
  }
}

/**
 * Calculates simulated outcome for the What-If Simulator dynamically
 */
export const simulateIntervention = (zone, interventionType, magnitude) => {
  const beforeRisk = calculateZoneRisk(zone)
  const afterRisk = calculateZoneRisk({
    ...zone,
    intervention: {
      type: interventionType,
      magnitude: Number(magnitude)
    }
  })

  return {
    before: {
      pressure: beforeRisk.effectivePressure,
      riskScore: beforeRisk.riskScore,
      riskLevel: beforeRisk.riskLevel,
    },
    after: {
      pressure: afterRisk.effectivePressure,
      riskScore: afterRisk.riskScore,
      riskLevel: afterRisk.riskLevel,
    },
    pressureChange: Number((afterRisk.effectivePressure - beforeRisk.effectivePressure).toFixed(2)),
    riskChange: afterRisk.riskScore - beforeRisk.riskScore,
    recommendation: afterRisk.recommendation,
  }
}
