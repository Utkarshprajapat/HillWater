const config = require('../config/riskConfig');

function calculateRisk(zone, latestReading, history) {
  let pressureScore = 0;
  let pressureStatus = 'NORMAL';
  let pressureMessage = 'Pressure is near baseline.';
  
  if (latestReading && zone.baselinePressure) {
    const dropPct = ((zone.baselinePressure - latestReading.pressure) / zone.baselinePressure) * 100;
    if (dropPct <= 0) {
      pressureScore = 0;
    } else if (dropPct <= config.thresholds.pressure.healthyDropPct) {
      pressureScore = (dropPct / config.thresholds.pressure.healthyDropPct) * 20;
    } else if (dropPct <= config.thresholds.pressure.moderateDropPct) {
      pressureScore = 20 + ((dropPct - config.thresholds.pressure.healthyDropPct) / (config.thresholds.pressure.moderateDropPct - config.thresholds.pressure.healthyDropPct)) * 30;
      pressureStatus = 'ELEVATED';
      pressureMessage = 'Pressure is moderately below the zone baseline.';
    } else if (dropPct <= config.thresholds.pressure.severeDropPct) {
      pressureScore = 50 + ((dropPct - config.thresholds.pressure.moderateDropPct) / (config.thresholds.pressure.severeDropPct - config.thresholds.pressure.moderateDropPct)) * 30;
      pressureStatus = 'HIGH';
      pressureMessage = 'Pressure is significantly below the zone baseline.';
    } else {
      pressureScore = 80 + Math.min(20, (dropPct - config.thresholds.pressure.severeDropPct)); // Max 100
      pressureStatus = 'CRITICAL';
      pressureMessage = 'Critically reduced pressure detected.';
    }
  }

  // Trend Score
  let trendScore = 0;
  let trendStatus = 'STABLE';
  let trendMessage = 'Pressure is stable.';
  
  if (history && history.length >= config.thresholds.trend.historyLengthNeeded) {
    const recentReadings = history.slice(-config.thresholds.trend.historyLengthNeeded);
    const firstP = recentReadings[0].pressure;
    const lastP = recentReadings[recentReadings.length - 1].pressure;
    
    if (firstP > 0) {
      const changePct = (firstP - lastP) / firstP;
      
      if (changePct <= 0) {
        trendScore = 0;
        trendStatus = 'RECOVERING';
        trendMessage = 'Pressure is recovering or stable.';
      } else if (changePct <= config.thresholds.trend.stableVariation) {
        trendScore = 10;
        trendStatus = 'STABLE';
        trendMessage = 'Pressure trend is relatively stable.';
      } else if (changePct <= config.thresholds.trend.fallingThreshold) {
        trendScore = 40;
        trendStatus = 'FALLING';
        trendMessage = 'Pressure is gradually falling.';
      } else if (changePct <= config.thresholds.trend.rapidDropThreshold) {
        trendScore = 75;
        trendStatus = 'RAPID_DECLINE';
        trendMessage = 'Pressure is rapidly falling.';
      } else {
        trendScore = 100;
        trendStatus = 'CRITICAL_DROP';
        trendMessage = 'Critically rapid pressure decline.';
      }
    }
  } else {
    trendScore = 10; // neutral low
    trendStatus = 'INSUFFICIENT_HISTORY';
    trendMessage = 'Insufficient historical data for trend analysis.';
  }

  // Flow Score
  let flowScore = 0;
  let flowStatus = 'NORMAL';
  let flowMessage = 'Flow is normal relative to capacity.';
  
  if (latestReading && zone.capacity) {
    const flowPct = (latestReading.flow / zone.capacity) * 100;
    if (flowPct >= config.thresholds.flow.expectedMinPct) {
      flowScore = 10;
    } else if (flowPct >= config.thresholds.flow.severeMinPct) {
      flowScore = 50;
      flowStatus = 'LOW';
      flowMessage = 'Unexpectedly low flow.';
    } else {
      flowScore = 90;
      flowStatus = 'VERY_LOW';
      flowMessage = 'Very low flow detected.';
    }
    
    if (pressureScore > 50 && flowPct > 100) {
      flowScore = Math.max(flowScore, 80);
      flowStatus = 'ABNORMAL_HIGH';
      flowMessage = 'Possible abnormal demand or distribution loss.';
    }
  }

  // Tank Level Score
  let tankScore = 0;
  let tankStatus = 'HEALTHY';
  let tankMessage = 'Tank level is healthy.';
  
  if (latestReading && latestReading.tankLevel !== undefined) {
    const level = latestReading.tankLevel;
    if (level >= config.thresholds.tank.healthyMin) {
      tankScore = 0;
    } else if (level >= config.thresholds.tank.moderateMin) {
      tankScore = 30;
      tankStatus = 'MODERATE';
      tankMessage = 'Tank level is moderate.';
    } else if (level >= config.thresholds.tank.lowMin) {
      tankScore = 70;
      tankStatus = 'LOW';
      tankMessage = 'Tank level is low.';
    } else {
      tankScore = 100;
      tankStatus = 'CRITICAL';
      tankMessage = 'Critically low tank level.';
    }
  }

  // Demand Score
  let demandScore = 0;
  let demandStatus = 'NORMAL';
  let demandMessage = 'Demand is within normal limits.';
  
  const demandPct = (zone.demand / zone.capacity) * 100;
  if (demandPct <= config.thresholds.demand.lowMax) {
    demandScore = 10;
  } else if (demandPct <= config.thresholds.demand.moderateMax) {
    demandScore = 40;
    demandStatus = 'ELEVATED';
    demandMessage = 'Moderate demand detected.';
  } else if (demandPct <= config.thresholds.demand.highMax) {
    demandScore = 75;
    demandStatus = 'HIGH';
    demandMessage = 'Current demand is placing additional stress on the zone.';
  } else {
    demandScore = 100;
    demandStatus = 'SEVERE';
    demandMessage = 'Severe demand stress on the zone.';
  }

  // Elevation Score
  let elevationScore = 0;
  let elevationStatus = 'NORMAL';
  let elevationMessage = 'Elevation is not significantly contributing to risk.';
  
  const normalizedElevation = Math.max(0, Math.min(1, (zone.elevation - config.thresholds.elevation.base) / (config.thresholds.elevation.high - config.thresholds.elevation.base)));
  
  // Elevation stress is a multiplier based on existing pressure and demand issues
  if (pressureScore > 50 || demandScore > 60) {
    elevationScore = normalizedElevation * Math.max(pressureScore, demandScore);
    if (elevationScore > 40) {
      elevationStatus = 'ELEVATED_VULNERABILITY';
      elevationMessage = 'Higher elevation increases vulnerability under current stress.';
    }
  }

  // Normalize scores to max 100
  pressureScore = Math.min(100, Math.max(0, pressureScore));
  trendScore = Math.min(100, Math.max(0, trendScore));
  flowScore = Math.min(100, Math.max(0, flowScore));
  tankScore = Math.min(100, Math.max(0, tankScore));
  demandScore = Math.min(100, Math.max(0, demandScore));
  elevationScore = Math.min(100, Math.max(0, elevationScore));

  const finalRisk = Math.round(
    pressureScore * config.weights.pressure +
    trendScore * config.weights.trend +
    demandScore * config.weights.demand +
    flowScore * config.weights.flow +
    tankScore * config.weights.tankLevel +
    elevationScore * config.weights.elevation
  );

  let riskLevel = 'LOW';
  for (const band of config.bands) {
    if (finalRisk <= band.max) {
      riskLevel = band.level;
      break;
    }
  }

  let factors = [
    { name: 'Pressure', score: Math.round(pressureScore), weight: config.weights.pressure * 100, status: pressureStatus, message: pressureMessage },
    { name: 'Pressure Trend', score: Math.round(trendScore), weight: config.weights.trend * 100, status: trendStatus, message: trendMessage },
    { name: 'Demand Stress', score: Math.round(demandScore), weight: config.weights.demand * 100, status: demandStatus, message: demandMessage },
    { name: 'Flow', score: Math.round(flowScore), weight: config.weights.flow * 100, status: flowStatus, message: flowMessage },
    { name: 'Tank Level', score: Math.round(tankScore), weight: config.weights.tankLevel * 100, status: tankStatus, message: tankMessage },
    { name: 'Elevation', score: Math.round(elevationScore), weight: config.weights.elevation * 100, status: elevationStatus, message: elevationMessage }
  ];

  // Sort by contribution: (score * weight)
  factors.sort((a, b) => (b.score * b.weight) - (a.score * a.weight));

  return {
    score: Math.min(100, Math.max(0, finalRisk)),
    level: riskLevel,
    factors: factors
  };
}

module.exports = {
  calculateRisk
};
