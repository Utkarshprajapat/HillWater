const riskEngine = require('./services/riskEngine');
const explanationEngine = require('./services/explanationEngine');

const baseZone = { id: 'test-zone', name: 'Test Zone', elevation: 1950, baselinePressure: 14, capacity: 100, demand: 65 };

function evaluateScenario(name, zoneOverrides, reading, history) {
  const zone = { ...baseZone, ...zoneOverrides };
  const riskResult = riskEngine.calculateRisk(zone, reading, history);
  
  // Enrich factors
  riskResult.factors = riskResult.factors.map(f => {
    f.contribution = Math.round(f.score * (f.weight / 100));
    return f;
  }).sort((a, b) => b.contribution - a.contribution);

  const explanation = explanationEngine.getExplanationAndRecommendation(riskResult);
  
  console.log(`\n=== SCENARIO: ${name} ===`);
  console.log(`Primary Cause: ${explanation.primaryCause.type} (Confidence: ${explanation.primaryCause.confidence})`);
  console.log(`Label: ${explanation.primaryCause.label}`);
  console.log(`Recommendation: ${explanation.recommendation.action}`);
  console.log(`Evidence count: ${explanation.supportingEvidence.length}`);
}

// TEST 1 — NORMAL
evaluateScenario('NORMAL', {}, 
  { pressure: 14, flow: 80, tankLevel: 80 }, 
  [{pressure: 14}, {pressure: 14}, {pressure: 14}]
);

// TEST 2 — DEMAND STRESS
evaluateScenario('DEMAND STRESS', { demand: 95 }, 
  { pressure: 11, flow: 85, tankLevel: 75 }, 
  [{pressure: 14}, {pressure: 13}, {pressure: 11}]
);

// TEST 3 — SUPPLY RESTRICTION
evaluateScenario('SUPPLY RESTRICTION', {}, 
  { pressure: 9, flow: 30, tankLevel: 30 }, 
  [{pressure: 11}, {pressure: 10}, {pressure: 9}]
);

// TEST 4 — POSSIBLE DISTRIBUTION LOSS
evaluateScenario('POSSIBLE DISTRIBUTION LOSS', {}, 
  { pressure: 9, flow: 150, tankLevel: 30 }, 
  [{pressure: 11}, {pressure: 10}, {pressure: 9}]
);

// TEST 5 — LOW RESERVOIR
evaluateScenario('LOW RESERVOIR', {}, 
  { pressure: 9, flow: 50, tankLevel: 15 }, 
  [{pressure: 11}, {pressure: 10}, {pressure: 9}]
);

// TEST 6 — RAPID DETERIORATION
evaluateScenario('RAPID DETERIORATION', {}, 
  { pressure: 10.5, flow: 80, tankLevel: 80 }, 
  [{pressure: 13.8}, {pressure: 13.0}, {pressure: 12.0}, {pressure: 10.5}]
);

// TEST 7 — RECOVERY
evaluateScenario('RECOVERY', {}, 
  { pressure: 13.8, flow: 80, tankLevel: 80 }, 
  [{pressure: 10.5}, {pressure: 11.8}, {pressure: 13.0}, {pressure: 13.8}]
);

// TEST 8 — INSUFFICIENT DATA
evaluateScenario('INSUFFICIENT DATA', {}, 
  { pressure: 14, flow: 80, tankLevel: 80 }, 
  [] // No history
);

// TEST 9 — API COMPATIBILITY
const riskService = require('./services/riskService');
console.log('\n=== TEST API GET ZONE RISK ===');
const apiRes = riskService.getZoneRisk('mallital');
console.log(JSON.stringify(apiRes, null, 2));

