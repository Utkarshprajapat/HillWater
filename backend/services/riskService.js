const dataService = require('./dataService');
const riskEngine = require('./riskEngine');
const explanationEngine = require('./explanationEngine');

function getZoneRisk(zoneId) {
  const details = dataService.getZoneDetails(zoneId);
  if (!details) {
    return null;
  }

  const { zone, latestReading } = details;
  
  // Get history
  const sensorStore = require('../data/sensorStore');
  const history = sensorStore.getHistory(zoneId);

  // Risk calculation
  const riskResult = riskEngine.calculateRisk(zone, latestReading, history);
  
  // Explanation and Recommendation
  const explanation = explanationEngine.getExplanationAndRecommendation(riskResult);

  // Enhance factors to include contribution and sort by actual contribution
  let enrichedFactors = riskResult.factors.map(f => {
    f.contribution = Math.round(f.score * (f.weight / 100));
    return f;
  });
  enrichedFactors.sort((a, b) => b.contribution - a.contribution);
  riskResult.factors = enrichedFactors;

  // Add legacy likelyCause/recommendation for backwards compatibility
  riskResult.likelyCause = explanation.primaryCause.label;
  riskResult.recommendation = explanation.recommendation.action;

  return {
    zone: {
      id: zone.id,
      name: zone.name,
      elevation: zone.elevation
    },
    risk: riskResult,
    explanation: explanation
  };
}

function getAllRisks() {
  const zones = dataService.getAllZones();
  const risks = zones.map(zone => {
    const riskData = getZoneRisk(zone.id);
    return {
      zoneId: zone.id,
      zoneName: zone.name,
      riskScore: riskData.risk.score,
      riskLevel: riskData.risk.level
    };
  });
  return risks;
}

module.exports = {
  getZoneRisk,
  getAllRisks
};
