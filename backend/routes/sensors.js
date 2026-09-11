const express = require('express');
const router = express.Router();
const sensorStore = require('../data/sensorStore');
const riskService = require('../services/riskService');
const alertEngine = require('../services/alertEngine');

// POST /api/sensors/readings
router.post('/readings', (req, res) => {
  try {
    const reading = req.body;
    
    // Add timestamp if not provided by hardware/simulator
    if (!reading.timestamp) {
      reading.timestamp = new Date().toISOString();
    }

    // 1. Get PREVIOUS risk before updating sensor store
    let previousRiskData = null;
    try {
      previousRiskData = riskService.getZoneRisk(reading.zoneId);
    } catch (e) {
      // Ignore if zone not initialized yet
    }
    const previousRisk = previousRiskData ? previousRiskData.risk : null;

    // 2. Save reading
    const savedReading = sensorStore.saveReading(reading);

    // 3. Get CURRENT risk
    const currentRiskData = riskService.getZoneRisk(reading.zoneId);
    if (!currentRiskData) {
        return res.status(404).json({ success: false, message: 'Invalid zone for sensor data' });
    }
    
    const currentRisk = currentRiskData.risk;
    
    // Add confidence to risk object from explanation
    if (currentRiskData.explanation && currentRiskData.explanation.primaryCause) {
      currentRisk.confidence = currentRiskData.explanation.primaryCause.confidence;
      currentRisk.likelyCause = currentRiskData.explanation.primaryCause.label;
    }

    // 4. Evaluate Alert
    const history = sensorStore.getHistory(reading.zoneId);
    const alertResult = alertEngine.evaluateAlert(
      currentRiskData.zone, 
      currentRisk, 
      previousRisk, 
      history, 
      savedReading
    );

    // 5. Persist to SQLite History
    try {
      const db = require('../services/database');
      db.insertReading({
        deviceId: reading.deviceId || 'SIM-001',
        zoneId: reading.zoneId,
        pressure: savedReading.pressure,
        flow: savedReading.flow,
        tankLevel: savedReading.tankLevel,
        timestamp: savedReading.timestamp
      }).catch(err => console.error('DB Insert Reading Error:', err.message));

      db.insertRiskSnapshot(
        reading.zoneId,
        currentRisk.score,
        currentRisk.level,
        currentRisk.likelyCause || 'Unknown',
        savedReading.timestamp
      ).catch(err => console.error('DB Insert Risk Error:', err.message));

      if (alertResult.shouldAlert && alertResult.alert) {
        db.insertAlert(
          reading.zoneId,
          alertResult.alert.type,
          alertResult.alert.severity,
          alertResult.alert.message,
          savedReading.timestamp
        ).catch(err => console.error('DB Insert Alert Error:', err.message));
      }
    } catch (dbErr) {
      console.error('Database persistence error:', dbErr.message);
    }

    res.status(201).json({
      success: true,
      message: 'Sensor reading received',
      reading: savedReading,
      risk: {
        score: currentRisk.score,
        level: currentRisk.level
      },
      alert: alertResult.shouldAlert ? {
        created: true,
        type: alertResult.alert.type,
        severity: alertResult.alert.severity
      } : { created: false }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Invalid sensor data',
      error: error.message
    });
  }
});

module.exports = router;
