const express = require('express');
const router = express.Router();
const dataService = require('../services/dataService');

// GET /api/zones
router.get('/', (req, res) => {
  try {
    const zones = dataService.getAllZones();
    res.json({
      success: true,
      zones: zones
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
});

// GET /api/zones/:zoneId
router.get('/:zoneId', (req, res) => {
  try {
    const zoneId = req.params.zoneId;
    const details = dataService.getZoneDetails(zoneId);
    
    if (!details) {
      return res.status(404).json({
        success: false,
        message: `Zone not found: ${zoneId}`
      });
    }

    res.json({
      success: true,
      ...details
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
});

// GET /api/zones/:zoneId/risk
router.get('/:zoneId/risk', (req, res) => {
  try {
    const riskService = require('../services/riskService');
    const zoneId = req.params.zoneId;
    const riskData = riskService.getZoneRisk(zoneId);
    
    if (!riskData) {
      return res.status(404).json({
        success: false,
        message: `Zone not found: ${zoneId}`
      });
    }

    res.json({
      success: true,
      ...riskData
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
});

// GET /api/zones/:zoneId/alerts
router.get('/:zoneId/alerts', (req, res) => {
  try {
    const alertStore = require('../data/alertStore');
    const zoneId = req.params.zoneId;
    res.json({
      success: true,
      alerts: alertStore.getAlertsByZone(zoneId)
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
});

module.exports = router;
