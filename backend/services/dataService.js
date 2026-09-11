const zones = require('../data/zones');
const sensorStore = require('../data/sensorStore');

// Initialize with some demo data
function initializeDemoData() {
  const baseTimestamp = new Date().toISOString();
  
  const initialReadings = [
    { deviceId: 'HW-001', zoneId: 'mallital', pressure: 12.4, flow: 82.0, tankLevel: 71.0, timestamp: baseTimestamp },
    { deviceId: 'HW-002', zoneId: 'tallital', pressure: 11.8, flow: 78.5, tankLevel: 65.2, timestamp: baseTimestamp },
    { deviceId: 'HW-003', zoneId: 'sukhatal', pressure: 10.5, flow: 70.0, tankLevel: 55.0, timestamp: baseTimestamp },
    { deviceId: 'HW-004', zoneId: 'ayarpatta', pressure: 9.8, flow: 65.5, tankLevel: 45.5, timestamp: baseTimestamp },
    { deviceId: 'HW-005', zoneId: 'sher-ka-danda', pressure: 9.0, flow: 60.2, tankLevel: 40.0, timestamp: baseTimestamp },
    { deviceId: 'HW-006', zoneId: 'bara-bazaar', pressure: 13.2, flow: 88.0, tankLevel: 75.0, timestamp: baseTimestamp },
    { deviceId: 'HW-007', zoneId: 'mall-road', pressure: 12.8, flow: 85.5, tankLevel: 72.5, timestamp: baseTimestamp },
    { deviceId: 'HW-008', zoneId: 'bhotia-parao', pressure: 13.5, flow: 90.0, tankLevel: 80.0, timestamp: baseTimestamp },
    { deviceId: 'HW-009', zoneId: 'hospital-road', pressure: 12.5, flow: 84.0, tankLevel: 68.0, timestamp: baseTimestamp },
    { deviceId: 'HW-010', zoneId: 'talli-bamouri', pressure: 16.0, flow: 120.0, tankLevel: 90.0, timestamp: baseTimestamp },
    { deviceId: 'HW-011', zoneId: 'chhoti-kaimalta', pressure: 14.5, flow: 95.0, tankLevel: 85.0, timestamp: baseTimestamp },
    { deviceId: 'HW-012', zoneId: 'ratighat', pressure: 18.0, flow: 150.0, tankLevel: 95.0, timestamp: baseTimestamp }
  ];

  initialReadings.forEach(reading => {
    sensorStore.saveReading(reading);
  });
}

function getAllZones() {
  return zones;
}

function getZoneDetails(zoneId) {
  const zone = zones.find(z => z.id === zoneId);
  if (!zone) return null;

  const latestReading = sensorStore.getLatestReading(zoneId);
  const history = sensorStore.getHistory(zoneId);

  return {
    zone,
    latestReading,
    historyCount: history.length
  };
}

module.exports = {
  initializeDemoData,
  getAllZones,
  getZoneDetails
};
