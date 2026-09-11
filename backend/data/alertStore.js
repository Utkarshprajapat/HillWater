const alerts = [];
let nextAlertId = 1;

function createAlert(alertData) {
  const alert = {
    id: `alert-${Date.now()}-${nextAlertId++}`,
    timestamp: new Date().toISOString(),
    acknowledged: false,
    resolved: false,
    ...alertData
  };
  alerts.push(alert);
  return alert;
}

function getAlerts() {
  return alerts;
}

function getAlertsByZone(zoneId) {
  return alerts.filter(a => a.zoneId === zoneId);
}

function getLatestAlerts(limit = 50) {
  return alerts.slice(-limit);
}

function getLastAlertForZone(zoneId) {
  const zoneAlerts = getAlertsByZone(zoneId);
  if (zoneAlerts.length > 0) {
    return zoneAlerts[zoneAlerts.length - 1];
  }
  return null;
}

function acknowledgeAlert(alertId) {
  const alert = alerts.find(a => a.id === alertId);
  if (alert) {
    alert.acknowledged = true;
    alert.status = 'Acknowledged';
  }
  return alert || null;
}

function clearAlerts() {
  alerts.length = 0;
}

module.exports = {
  createAlert,
  getAlerts,
  getAlertsByZone,
  getLatestAlerts,
  getLastAlertForZone,
  acknowledgeAlert,
  clearAlerts
};
