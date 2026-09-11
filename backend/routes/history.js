const express = require('express');
const router = express.Router();
const db = require('../services/database');

const parseHours = (query) => {
  if (!query) return 24;
  if (query === '24h') return 24;
  if (query === '7d') return 168;
  if (query === '30d') return 720;
  return parseInt(query, 10) || 24;
};

// GET /api/history/zones/:zoneId/readings
router.get('/zones/:zoneId/readings', async (req, res) => {
  try {
    const hours = parseHours(req.query.hours || req.query.timeRange);
    const readings = await db.getHistoricalReadings(req.params.zoneId, hours);
    res.json({
      success: true,
      zoneId: req.params.zoneId,
      hours,
      data: readings
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Database error', error: error.message });
  }
});

// GET /api/history/zones/:zoneId/risk
router.get('/zones/:zoneId/risk', async (req, res) => {
  try {
    const hours = parseHours(req.query.hours || req.query.timeRange);
    const risk = await db.getHistoricalRisk(req.params.zoneId, hours);
    res.json({
      success: true,
      zoneId: req.params.zoneId,
      hours,
      data: risk
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Database error', error: error.message });
  }
});

// GET /api/history/zones/:zoneId/alerts
router.get('/zones/:zoneId/alerts', async (req, res) => {
  try {
    const hours = parseHours(req.query.hours || req.query.timeRange);
    const alerts = await db.getHistoricalAlerts(req.params.zoneId, hours);
    res.json({
      success: true,
      zoneId: req.params.zoneId,
      hours,
      data: alerts
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Database error', error: error.message });
  }
});

module.exports = router;
