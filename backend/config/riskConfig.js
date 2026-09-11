// Prototype engineering thresholds — configurable and intended for demonstration.
// Real deployment requires calibration using network-specific operational data,
// engineering standards, and field validation.

module.exports = {
  weights: {
    pressure: 0.30,
    trend: 0.20,
    demand: 0.15,
    flow: 0.15,
    tankLevel: 0.10,
    elevation: 0.10
  },
  
  bands: [
    { max: 30, level: 'LOW' },
    { max: 60, level: 'MODERATE' },
    { max: 80, level: 'HIGH' },
    { max: 100, level: 'CRITICAL' }
  ],
  
  thresholds: {
    pressure: {
      healthyDropPct: 10,
      moderateDropPct: 20,
      severeDropPct: 40
    },
    trend: {
      historyLengthNeeded: 3,
      stableVariation: 0.05,
      fallingThreshold: 0.10,
      rapidDropThreshold: 0.20
    },
    flow: {
      expectedMinPct: 70,
      severeMinPct: 40
    },
    tank: {
      healthyMin: 70,
      moderateMin: 40,
      lowMin: 20
    },
    demand: {
      lowMax: 60,
      moderateMax: 80,
      highMax: 90
    },
    elevation: {
      base: 1500,
      high: 2260
    }
  },

  explanation: {
    hypotheses: {
      DEMAND_STRESS: {
        label: "Possible demand-driven pressure stress",
        recommendation: "Consider temporary supply balancing or demand management and monitor pressure recovery.",
        priority: "HIGH"
      },
      SUPPLY_RESTRICTION: {
        label: "Possible upstream supply restriction",
        recommendation: "Inspect upstream supply conditions and verify source/reservoir availability.",
        priority: "HIGH"
      },
      POSSIBLE_DISTRIBUTION_LOSS: {
        label: "Possible distribution loss or abnormal flow condition.",
        recommendation: "Prioritize field verification of the affected distribution segment and inspect for abnormal flow conditions.",
        priority: "HIGH"
      },
      LOW_RESERVOIR_LEVEL: {
        label: "Low reservoir level may be contributing to service instability.",
        recommendation: "Check reservoir level and upstream replenishment/supply conditions.",
        priority: "HIGH"
      },
      RAPID_PRESSURE_DETERIORATION: {
        label: "Rapid pressure deterioration detected.",
        recommendation: "Prioritize near-term field inspection and monitor the zone for continued deterioration.",
        priority: "HIGH"
      },
      MULTI_SIGNAL_INSTABILITY: {
        label: "Multiple indicators suggest developing service instability.",
        recommendation: "Prioritize the zone for operational review and investigate upstream supply and distribution conditions.",
        priority: "HIGH"
      },
      NORMAL_OPERATION: {
        label: "No major instability detected.",
        recommendation: "Continue normal monitoring.",
        priority: "LOW"
      },
      INSUFFICIENT_DATA: {
        label: "Insufficient data to determine a likely cause.",
        recommendation: "Continue collecting sensor readings before making a stronger diagnosis.",
        priority: "LOW"
      }
    }
  },

  alerts: {
    duplicateSuppression: {
      minimumRiskChange: 3, // risk must change by at least 3 points to re-trigger same severity
      suppressionTimeMs: 5 * 60 * 1000 // optional: time-based suppression
    },
    earlyWarning: {
      minimumTrendIncrease: 5, // minimum risk increase over recent history to trigger early warning
      minimumRiskRequired: 40 // minimum risk to even consider early warning
    },
    dataQuality: {
      staleThresholdMs: 15 * 60 * 1000, // 15 mins
      minPressure: 0,
      maxPressure: 200,
      minTankLevel: 0,
      maxTankLevel: 100
    }
  }
};
