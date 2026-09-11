const express = require('express');
const router = express.Router();
const simulator = require('../simulator/sensorSimulator');

// GET /api/simulator/status
router.get('/status', (req, res) => {
  res.json({ success: true, ...simulator.getStatus() });
});

// POST /api/simulator/start
router.post('/start', (req, res) => {
  const { zoneId, deviceId, scenario } = req.body;
  const status = simulator.start(zoneId, deviceId, scenario);
  res.json({ success: true, message: 'Simulator started', ...status });
});

// POST /api/simulator/stop
router.post('/stop', (req, res) => {
  const status = simulator.stop();
  res.json({ success: true, message: 'Simulator stopped', ...status });
});

// POST /api/simulator/scenario
router.post('/scenario', (req, res) => {
  const { scenario } = req.body;
  if (!scenario) {
    return res.status(400).json({ success: false, message: 'Scenario name is required' });
  }
  const status = simulator.setScenario(scenario.toUpperCase());
  res.json({ success: true, message: `Scenario changed to ${scenario}`, ...status });
});

module.exports = router;
