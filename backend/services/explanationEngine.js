const config = require('../config/riskConfig');

function getExplanationAndRecommendation(riskResult) {
  const factors = riskResult.factors;
  
  const pFactor = factors.find(f => f.name === 'Pressure');
  const tFactor = factors.find(f => f.name === 'Pressure Trend');
  const dFactor = factors.find(f => f.name === 'Demand Stress');
  const fFactor = factors.find(f => f.name === 'Flow');
  const tankFactor = factors.find(f => f.name === 'Tank Level');
  const eFactor = factors.find(f => f.name === 'Elevation');

  let evidence = {
    DEMAND_STRESS: 0,
    SUPPLY_RESTRICTION: 0,
    POSSIBLE_DISTRIBUTION_LOSS: 0,
    LOW_RESERVOIR_LEVEL: 0,
    RAPID_PRESSURE_DETERIORATION: 0,
    NORMAL_OPERATION: 0,
    INSUFFICIENT_DATA: 0
  };

  const supportingEvidenceByHypothesis = {
    DEMAND_STRESS: [],
    SUPPLY_RESTRICTION: [],
    POSSIBLE_DISTRIBUTION_LOSS: [],
    LOW_RESERVOIR_LEVEL: [],
    RAPID_PRESSURE_DETERIORATION: [],
    NORMAL_OPERATION: [],
    INSUFFICIENT_DATA: [],
    MULTI_SIGNAL_INSTABILITY: []
  };

  // Check data sufficiency
  if (!pFactor || tFactor.status === 'INSUFFICIENT_HISTORY') {
    evidence.INSUFFICIENT_DATA = 100;
    if (tFactor && tFactor.status === 'INSUFFICIENT_HISTORY') {
      supportingEvidenceByHypothesis.INSUFFICIENT_DATA.push({
        signal: 'Pressure Trend',
        value: null,
        effect: 'MISSING',
        message: 'Pressure history is insufficient.'
      });
    }
  } else if (riskResult.score <= 30) {
    evidence.NORMAL_OPERATION = 100 - riskResult.score; // Confidence scales with how low the risk is
    supportingEvidenceByHypothesis.NORMAL_OPERATION.push({
        signal: 'Overall Risk',
        value: riskResult.score,
        effect: 'STABLE',
        message: 'All monitored signals are within expected ranges.'
    });
  } else {
    // DEMAND_STRESS
    if (dFactor.score > 40) {
      evidence.DEMAND_STRESS += 40;
      supportingEvidenceByHypothesis.DEMAND_STRESS.push({ signal: 'Demand', value: dFactor.score, effect: 'HIGH', message: dFactor.message });
    }
    if (pFactor.score > 20) {
      evidence.DEMAND_STRESS += 25;
      supportingEvidenceByHypothesis.DEMAND_STRESS.push({ signal: 'Pressure', value: pFactor.score, effect: 'LOW', message: pFactor.message });
    }
    if (tFactor.score > 10) {
      evidence.DEMAND_STRESS += 20;
      supportingEvidenceByHypothesis.DEMAND_STRESS.push({ signal: 'Pressure Trend', value: tFactor.score, effect: 'DECLINING', message: tFactor.message });
    }
    if (eFactor.score > 20) {
      evidence.DEMAND_STRESS += 15;
    }

    // SUPPLY_RESTRICTION
    if (pFactor.score > 50) {
      evidence.SUPPLY_RESTRICTION += 30;
      supportingEvidenceByHypothesis.SUPPLY_RESTRICTION.push({ signal: 'Pressure', value: pFactor.score, effect: 'LOW', message: pFactor.message });
    }
    if (fFactor.status === 'LOW' || fFactor.status === 'VERY_LOW') {
      evidence.SUPPLY_RESTRICTION += 30;
      supportingEvidenceByHypothesis.SUPPLY_RESTRICTION.push({ signal: 'Flow', value: fFactor.score, effect: 'LOW', message: fFactor.message });
    }
    if (tankFactor.score > 30) {
      evidence.SUPPLY_RESTRICTION += 25;
      supportingEvidenceByHypothesis.SUPPLY_RESTRICTION.push({ signal: 'Tank Level', value: tankFactor.score, effect: 'DECLINING', message: tankFactor.message });
    }
    if (dFactor.score <= 40 && pFactor.score > 50) {
      evidence.SUPPLY_RESTRICTION += 15;
      supportingEvidenceByHypothesis.SUPPLY_RESTRICTION.push({ signal: 'Demand', value: dFactor.score, effect: 'NORMAL', message: 'Demand is not unusually high, ruling out demand stress.' });
    }

    // POSSIBLE_DISTRIBUTION_LOSS
    if (pFactor.score > 50) {
      evidence.POSSIBLE_DISTRIBUTION_LOSS += 30;
      supportingEvidenceByHypothesis.POSSIBLE_DISTRIBUTION_LOSS.push({ signal: 'Pressure', value: pFactor.score, effect: 'LOW', message: pFactor.message });
    }
    if (fFactor.status === 'ABNORMAL_HIGH') {
      evidence.POSSIBLE_DISTRIBUTION_LOSS += 40;
      supportingEvidenceByHypothesis.POSSIBLE_DISTRIBUTION_LOSS.push({ signal: 'Flow', value: fFactor.score, effect: 'ABNORMAL_HIGH', message: fFactor.message });
    }
    if (tankFactor.score > 30) {
      evidence.POSSIBLE_DISTRIBUTION_LOSS += 30;
      supportingEvidenceByHypothesis.POSSIBLE_DISTRIBUTION_LOSS.push({ signal: 'Tank Level', value: tankFactor.score, effect: 'DECLINING', message: tankFactor.message });
    }

    // LOW_RESERVOIR_LEVEL
    if (tankFactor.score > 60) {
      evidence.LOW_RESERVOIR_LEVEL += 60;
      supportingEvidenceByHypothesis.LOW_RESERVOIR_LEVEL.push({ signal: 'Tank Level', value: tankFactor.score, effect: 'CRITICAL', message: tankFactor.message });
    }
    if (pFactor.score > 40 && tankFactor.score > 60) {
      evidence.LOW_RESERVOIR_LEVEL += 30;
      supportingEvidenceByHypothesis.LOW_RESERVOIR_LEVEL.push({ signal: 'Pressure', value: pFactor.score, effect: 'LOW', message: pFactor.message });
    }
    if ((fFactor.status === 'LOW' || fFactor.status === 'VERY_LOW') && tankFactor.score > 60) {
      evidence.LOW_RESERVOIR_LEVEL += 20;
      supportingEvidenceByHypothesis.LOW_RESERVOIR_LEVEL.push({ signal: 'Flow', value: fFactor.score, effect: 'LOW', message: fFactor.message });
    }

    // RAPID_PRESSURE_DETERIORATION
    if (tFactor.status === 'RAPID_DECLINE' || tFactor.status === 'CRITICAL_DROP') {
      evidence.RAPID_PRESSURE_DETERIORATION += 70;
      supportingEvidenceByHypothesis.RAPID_PRESSURE_DETERIORATION.push({ signal: 'Pressure Trend', value: tFactor.score, effect: 'RAPID_DECLINE', message: tFactor.message });
    }
    if (pFactor.score > 40 && evidence.RAPID_PRESSURE_DETERIORATION > 0) {
      evidence.RAPID_PRESSURE_DETERIORATION += 30;
      supportingEvidenceByHypothesis.RAPID_PRESSURE_DETERIORATION.push({ signal: 'Pressure', value: pFactor.score, effect: 'LOW', message: pFactor.message });
    }
  }

  // Determine top hypothesis
  let topHypothesis = 'INSUFFICIENT_DATA';
  let maxConfidence = -1;

  for (const [hyp, conf] of Object.entries(evidence)) {
    if (conf > maxConfidence) {
      maxConfidence = conf;
      topHypothesis = hyp;
    }
  }

  // Cap confidence at 100
  maxConfidence = Math.min(100, maxConfidence);

  // Safeguards
  if (topHypothesis !== 'NORMAL_OPERATION' && topHypothesis !== 'INSUFFICIENT_DATA') {
    if (maxConfidence < 40) {
      topHypothesis = 'MULTI_SIGNAL_INSTABILITY';
      maxConfidence = 50;
      supportingEvidenceByHypothesis.MULTI_SIGNAL_INSTABILITY = riskResult.factors
        .filter(f => f.score > 30)
        .map(f => ({ signal: f.name, value: f.score, effect: f.status, message: f.message }));
    }
  }

  const hypothesisConfig = config.explanation.hypotheses[topHypothesis];

  let secondaryFactors = [];
  if (eFactor && eFactor.score > 30) {
      secondaryFactors.push("Elevated terrain may increase pressure vulnerability under current demand conditions.");
  }
  if (topHypothesis !== 'LOW_RESERVOIR_LEVEL' && tankFactor && tankFactor.score > 30) {
      secondaryFactors.push("Tank level is moderately declining.");
  }

  return {
    primaryCause: {
      type: topHypothesis,
      label: hypothesisConfig.label,
      confidence: maxConfidence
    },
    supportingEvidence: supportingEvidenceByHypothesis[topHypothesis] || [],
    secondaryFactors: secondaryFactors,
    recommendation: {
      priority: hypothesisConfig.priority,
      action: hypothesisConfig.recommendation
    }
  };
}

module.exports = {
  getExplanationAndRecommendation
};
