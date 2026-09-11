const scenarios = require('./scenarios');

let isRunning = false;
let currentZoneId = 'mallital';
let currentDeviceId = process.env.SIMULATOR_DEVICE_ID || 'SIM-001';
let currentScenarioId = 'NORMAL';
let currentTick = 0;
let intervalId = null;
let intervalMs = parseInt(process.env.SIMULATOR_INTERVAL_MS) || 3000;

// Internal API base URL, dynamically targeting the correct local backend port
const port = process.env.PORT || 5000;
const API_URL = `http://127.0.0.1:${port}/api/sensors/readings`;

function getStatus() {
  return {
    running: isRunning,
    deviceId: currentDeviceId,
    zoneId: currentZoneId,
    scenario: currentScenarioId,
    tick: currentTick,
    intervalMs: intervalMs
  };
}

function start(zoneId = 'mallital', deviceId = 'SIM-001', scenario = 'NORMAL') {
  currentZoneId = zoneId;
  currentDeviceId = deviceId;
  currentScenarioId = scenario;
  currentTick = 0;
  
  if (!scenarios[currentScenarioId]) {
    currentScenarioId = 'NORMAL';
  }

  if (isRunning) {
    stop();
  }

  isRunning = true;
  intervalId = setInterval(tick, intervalMs);
  return getStatus();
}

function stop() {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
  isRunning = false;
  return getStatus();
}

function setScenario(scenario) {
  if (scenarios[scenario]) {
    currentScenarioId = scenario;
    currentTick = 0;
  }
  return getStatus();
}

async function tick() {
  if (!isRunning) return;

  const scenarioData = scenarios[currentScenarioId];
  if (!scenarioData) return;

  // Determine which step we are on
  let stepIndex = currentTick;
  if (stepIndex >= scenarioData.steps.length) {
    if (scenarioData.loop) {
      stepIndex = stepIndex % scenarioData.steps.length;
    } else {
      // Hold the last state if we don't loop
      stepIndex = scenarioData.steps.length - 1;
    }
  }

  const currentStep = scenarioData.steps[stepIndex];
  currentTick++;

  const payload = {
    deviceId: currentDeviceId,
    zoneId: currentZoneId,
    pressure: currentStep.pressure,
    flow: currentStep.flow,
    tankLevel: currentStep.tankLevel,
    timestamp: new Date().toISOString()
  };

  try {
    // Dynamic import of node-fetch or native fetch in Node 18+
    if (typeof fetch === 'undefined') {
        console.error('Simulator requires Node 18+ (native fetch)');
        return;
    }

    await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });
    // Fire and forget; backend decides risk and alerts
  } catch (error) {
    console.error(`Simulator failed to POST reading: ${error.message}`);
  }
}

module.exports = {
  getStatus,
  start,
  stop,
  setScenario
};

// If run directly from terminal:
if (require.main === module) {
  const args = process.argv.slice(2);
  let scenario = 'NORMAL';
  const scenarioIndex = args.indexOf('--scenario');
  if (scenarioIndex > -1 && args[scenarioIndex + 1]) {
    scenario = args[scenarioIndex + 1].toUpperCase();
  }
  
  console.log(`Starting HillWater Sensor Simulator...`);
  console.log(`Zone: mallital | Device: SIM-001 | Scenario: ${scenario}`);
  console.log(`Posting data to ${API_URL} every ${intervalMs}ms...`);
  
  start('mallital', 'SIM-001', scenario);
}
