const config = require('../config/riskConfig');
const alertStore = require('../data/alertStore');

function evaluateAlert(zone, currentRisk, previousRisk, history, currentReading) {
  let shouldAlert = false;
  let alertDetails = null;

  const prevScore = previousRisk ? previousRisk.score : 0;
  const currScore = currentRisk.score;
  const prevLevel = previousRisk ? previousRisk.level : 'LOW';
  const currLevel = currentRisk.level;

  const lastAlert = alertStore.getLastAlertForZone(zone.id);

  // 1. Data Quality Check
  if (currentReading) {
    const isStale = new Date() - new Date(currentReading.timestamp) > config.alerts.dataQuality.staleThresholdMs;
    const isInvalid = currentReading.pressure < config.alerts.dataQuality.minPressure || 
                      currentReading.pressure > config.alerts.dataQuality.maxPressure ||
                      currentReading.tankLevel < config.alerts.dataQuality.minTankLevel ||
                      currentReading.tankLevel > config.alerts.dataQuality.maxTankLevel;
    
    if (isStale || isInvalid) {
      if (!lastAlert || lastAlert.type !== 'DATA_QUALITY') {
        return {
          shouldAlert: true,
          alert: {
            type: 'DATA_QUALITY',
            severity: 'MEDIUM',
            zoneId: zone.id,
            zoneName: zone.name,
            riskScore: currScore,
            previousRiskScore: prevScore,
            title: 'Sensor Data Quality Issue',
            message: `Sensor data may be stale or invalid for ${zone.name}.`,
            likelyCause: 'Network delay or sensor calibration issue.',
            confidence: 100,
            evidence: [{ signal: 'Sensor Reading', value: null, effect: 'INVALID', message: 'Data outside normal operating ranges or timestamp too old.' }],
            recommendation: { priority: 'MEDIUM', action: 'Verify sensor connectivity and calibration.' }
          }
        };
      }
    }
  }

  // Determine standard alert triggers
  const isRapidDeterioration = currentRisk.factors && currentRisk.factors.find(f => f.name === 'Pressure Trend' && f.status === 'RAPID_DECLINE');
  const isEscalation = currLevel !== prevLevel && currScore > prevScore;
  const isRecovery = currLevel !== prevLevel && currScore < prevScore && currScore <= 60;
  
  // Early Warning Logic
  let isEarlyWarning = false;
  if (currLevel === 'MODERATE' && currScore >= config.alerts.earlyWarning.minimumRiskRequired) {
    if (history && history.length >= 3) {
      const pastRisk = previousRisk ? previousRisk.score : currScore; // simplify: rely on previousRisk param logic in riskService
      if (currScore - prevScore >= config.alerts.earlyWarning.minimumTrendIncrease) {
        isEarlyWarning = true;
      }
    }
  }

  // Duplicate suppression
  const riskChangedMeaningfully = Math.abs(currScore - prevScore) >= config.alerts.duplicateSuppression.minimumRiskChange;

  if (currLevel === 'CRITICAL') {
    if (!lastAlert || lastAlert.type !== 'CRITICAL_RISK' || riskChangedMeaningfully) {
      shouldAlert = true;
      alertDetails = {
        type: 'CRITICAL_RISK',
        severity: 'CRITICAL',
        title: 'Critical Service Instability',
        message: `Critical service instability risk detected in ${zone.name}.`,
        recommendation: { priority: 'CRITICAL', action: currentRisk.recommendation || 'Prioritize immediate field inspection.' }
      };
    }
  } else if (isRapidDeterioration) {
    if (!lastAlert || lastAlert.type !== 'RAPID_DETERIORATION') {
      shouldAlert = true;
      alertDetails = {
        type: 'RAPID_DETERIORATION',
        severity: 'HIGH',
        title: 'Rapid Deterioration Detected',
        message: `Rapid pressure deterioration detected in ${zone.name}.`,
        recommendation: { priority: 'HIGH', action: currentRisk.recommendation || 'Inspect upstream supply immediately.' }
      };
    }
  } else if (currLevel === 'HIGH' && (!lastAlert || lastAlert.type !== 'HIGH_RISK' || riskChangedMeaningfully) && !isEscalation) {
    // Treat as HIGH_RISK if it didn't just escalate
    shouldAlert = true;
    alertDetails = {
      type: 'HIGH_RISK',
      severity: 'HIGH',
      title: 'High Service-Failure Risk',
      message: `High service-failure risk detected in ${zone.name}.`,
      recommendation: { priority: 'HIGH', action: currentRisk.recommendation }
    };
  } else if (isEscalation) {
    shouldAlert = true;
    alertDetails = {
      type: 'RISK_ESCALATION',
      severity: currLevel === 'CRITICAL' ? 'CRITICAL' : 'HIGH',
      title: 'Risk Escalation Detected',
      message: `${zone.name} has entered ${currLevel} service-failure risk.`,
      recommendation: { priority: 'HIGH', action: currentRisk.recommendation }
    };
  } else if (isEarlyWarning) {
    if (!lastAlert || lastAlert.type !== 'EARLY_WARNING') {
      shouldAlert = true;
      alertDetails = {
        type: 'EARLY_WARNING',
        severity: 'MEDIUM',
        title: 'Early Service Instability Detected',
        message: `Early signs of service instability detected in ${zone.name}. Risk remains moderate, but conditions are deteriorating.`,
        recommendation: { priority: 'MEDIUM', action: 'Monitor the zone closely and review supply/demand conditions.' }
      };
    }
  } else if (isRecovery) {
    if (lastAlert && lastAlert.type !== 'RECOVERY' && lastAlert.type !== 'NORMAL_OPERATION') {
      shouldAlert = true;
      alertDetails = {
        type: 'RECOVERY',
        severity: 'LOW',
        title: 'Service Recovery',
        message: `${zone.name} service conditions are recovering.`,
        recommendation: { priority: 'LOW', action: 'Continue monitoring to confirm sustained recovery.' }
      };
    }
  }

  if (shouldAlert && alertDetails) {
    return {
      shouldAlert: true,
      alert: alertStore.createAlert({
        zoneId: zone.id,
        zoneName: zone.name,
        riskScore: currScore,
        previousRiskScore: prevScore,
        likelyCause: currentRisk.likelyCause || 'Unknown',
        confidence: currentRisk.confidence || 100, // Pass through confidence if attached
        evidence: currentRisk.factors || [],
        ...alertDetails
      })
    };
  }

  return { shouldAlert: false, alert: null };
}

module.exports = {
  evaluateAlert
};
