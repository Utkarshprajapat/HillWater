const express = require('express');
const cors = require('cors');
const dataService = require('./services/dataService');

const app = express();
const PORT = process.env.PORT || 5000;
const allowedOrigin = process.env.FRONTEND_URL || 'http://localhost:5173';

// Middleware
app.use(cors({
  origin: allowedOrigin,
  credentials: true
}));
app.use(express.json());

// Initialize demo data
dataService.initializeDemoData();

// Initialize database
require('./services/database');

// Routes
const zonesRoutes = require('./routes/zones');
const sensorsRoutes = require('./routes/sensors');
const simulatorRoutes = require('./routes/simulator');
const historyRoutes = require('./routes/history');

app.use('/api/zones', zonesRoutes);
app.use('/api/sensors', sensorsRoutes);
app.use('/api/simulator', simulatorRoutes);
app.use('/api/history', historyRoutes);

// Risk API (All Zones)
app.get('/api/risks', (req, res) => {
  try {
    const riskService = require('./services/riskService');
    const risks = riskService.getAllRisks();
    res.json({
      success: true,
      risks: risks
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
});

// Alerts API (All Zones)
app.get('/api/alerts', (req, res) => {
  try {
    const alertStore = require('./data/alertStore');
    res.json({
      success: true,
      alerts: alertStore.getLatestAlerts(100)
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
});

// Alert Acknowledge
app.post('/api/alerts/:alertId/acknowledge', (req, res) => {
  try {
    const alertStore = require('./data/alertStore');
    const { alertId } = req.params;
    const alert = alertStore.acknowledgeAlert(alertId);
    if (!alert) {
      return res.status(404).json({ success: false, message: `Alert not found: ${alertId}` });
    }
    res.json({ success: true, alert });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
});

// Zone Intervention API — records a real intervention in the audit/alert trail
app.post('/api/zones/:zoneId/intervene', (req, res) => {
  try {
    const alertStore = require('./data/alertStore');
    const riskService = require('./services/riskService');
    const { zoneId } = req.params;
    const { interventionType, action, setpoint, reason, operator } = req.body;

    const riskData = riskService.getZoneRisk(zoneId);
    if (!riskData) {
      return res.status(404).json({ success: false, message: `Zone not found: ${zoneId}` });
    }

    const now = new Date().toISOString();
    const interventionAlert = alertStore.createAlert({
      zoneId: riskData.zone.id,
      zoneName: riskData.zone.name,
      type: 'INTERVENTION',
      severity: 'INFO',
      title: 'Automated Intervention Applied',
      message: `${action || interventionType || 'Pressure setpoint adjustment'} applied to ${riskData.zone.name}. Reason: ${reason || 'High/Critical risk detected by HillWater AI.'}`,
      interventionType: interventionType || 'PRESSURE_SETPOINT',
      action: action || 'Pressure setpoint adjusted',
      setpoint: setpoint || null,
      operator: operator || 'HillWater AutoSystem',
      riskScore: riskData.risk.score,
      riskLevel: riskData.risk.level,
      likelyCause: riskData.risk.likelyCause || 'Unknown',
      confidence: riskData.risk.confidence || 100,
      evidence: riskData.risk.factors || [],
      recommendation: { priority: 'HIGH', action: riskData.risk.recommendation || 'Continue monitoring.' },
      timestamp: now
    });

    // Also persist to SQLite audit log
    try {
      const db = require('./services/database');
      db.insertAlert(
        riskData.zone.id,
        'INTERVENTION',
        'INFO',
        interventionAlert.message,
        now
      ).catch(err => console.error('DB Insert Intervention Error:', err.message));
    } catch (dbErr) {
      console.error('Database intervention persistence error:', dbErr.message);
    }

    res.json({
      success: true,
      message: 'Intervention recorded successfully',
      intervention: interventionAlert
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
});

// Demo Reset API — clears in-memory sensor history and alerts for a clean demo restart
app.post('/api/demo/reset', (req, res) => {
  try {
    const alertStore = require('./data/alertStore');
    const sensorStore = require('./data/sensorStore');
    const simulator = require('./simulator/sensorSimulator');

    // Stop simulator if running
    if (simulator.getStatus().running) {
      simulator.stop();
    }

    // Clear in-memory state
    alertStore.clearAlerts();
    sensorStore.clearHistory();

    res.json({
      success: true,
      message: 'Demo state reset. Alerts and sensor history cleared.'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
});

// Health Endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    service: 'HillWater Backend',
    status: 'healthy'
  });
});

// Centralized error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something broke!',
    error: err.message
  });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`HillWater backend running on http://0.0.0.0:${PORT}`);
});
