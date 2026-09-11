// In-memory sensor store.
// Can be replaced with SQLite or PostgreSQL later.

const store = {
  readings: {}, // latest reading per zoneId
  history: {}   // array of past readings per zoneId
};

const MAX_HISTORY_LENGTH = 100;

function saveReading(reading) {
  // Validate data format
  if (!reading || !reading.zoneId || !reading.deviceId) {
    throw new Error('Missing zoneId or deviceId');
  }
  if (typeof reading.pressure !== 'number' || isNaN(reading.pressure)) {
    throw new Error('Invalid or missing pressure');
  }
  if (typeof reading.flow !== 'number' || isNaN(reading.flow)) {
    throw new Error('Invalid or missing flow');
  }
  if (typeof reading.tankLevel !== 'number' || isNaN(reading.tankLevel)) {
    throw new Error('Invalid or missing tankLevel');
  }

  const zoneId = reading.zoneId;

  // Save latest
  store.readings[zoneId] = reading;

  // Save history
  if (!store.history[zoneId]) {
    store.history[zoneId] = [];
  }
  store.history[zoneId].push(reading);

  // Keep history manageable
  if (store.history[zoneId].length > MAX_HISTORY_LENGTH) {
    store.history[zoneId].shift(); // Remove oldest
  }

  return reading;
}

function getLatestReading(zoneId) {
  return store.readings[zoneId] || null;
}

function getHistory(zoneId) {
  return store.history[zoneId] || [];
}

function getAllLatestReadings() {
  return store.readings;
}

function clearHistory() {
  store.readings = {};
  store.history = {};
}

module.exports = {
  saveReading,
  getLatestReading,
  getHistory,
  getAllLatestReadings,
  clearHistory
};
