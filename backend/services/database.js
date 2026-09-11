const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

let dbPath = process.env.DB_PATH;

if (!dbPath) {
  const dbDir = path.join(__dirname, '../data');
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }
  dbPath = path.join(dbDir, 'hillwater.db');
} else {
  // Ensure the parent directory of DB_PATH exists
  const dbDir = path.dirname(dbPath);
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }
}
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database', err.message);
  } else {
    console.log('Connected to the SQLite database.');
    initializeDatabase();
  }
});

function initializeDatabase() {
  db.serialize(() => {
    // Enable WAL mode for better concurrency
    db.run('PRAGMA journal_mode = WAL');

    // Create sensor_readings table
    db.run(`
      CREATE TABLE IF NOT EXISTS sensor_readings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        device_id TEXT,
        zone_id TEXT,
        pressure REAL,
        flow REAL,
        tank_level REAL,
        timestamp TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create risk_snapshots table
    db.run(`
      CREATE TABLE IF NOT EXISTS risk_snapshots (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        zone_id TEXT,
        risk_score INTEGER,
        risk_level TEXT,
        primary_cause TEXT,
        timestamp TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create alerts_history table
    db.run(`
      CREATE TABLE IF NOT EXISTS alerts_history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        zone_id TEXT,
        alert_type TEXT,
        severity TEXT,
        message TEXT,
        timestamp TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create Indexes
    db.run(`CREATE INDEX IF NOT EXISTS idx_sensor_zone_time ON sensor_readings(zone_id, timestamp)`);
    db.run(`CREATE INDEX IF NOT EXISTS idx_risk_zone_time ON risk_snapshots(zone_id, timestamp)`);
    db.run(`CREATE INDEX IF NOT EXISTS idx_alert_zone_time ON alerts_history(zone_id, timestamp)`);
  });
}

const insertReading = (reading) => {
  return new Promise((resolve, reject) => {
    const { deviceId, zoneId, pressure, flow, tankLevel, timestamp } = reading;
    db.run(
      `INSERT INTO sensor_readings (device_id, zone_id, pressure, flow, tank_level, timestamp) VALUES (?, ?, ?, ?, ?, ?)`,
      [deviceId, zoneId, pressure, flow, tankLevel, timestamp],
      function(err) {
        if (err) {
          console.error('Failed to insert sensor reading:', err.message);
          return reject(err);
        }
        resolve(this.lastID);
      }
    );
  });
};

const insertRiskSnapshot = (zoneId, riskScore, riskLevel, primaryCause, timestamp) => {
  return new Promise((resolve, reject) => {
    db.run(
      `INSERT INTO risk_snapshots (zone_id, risk_score, risk_level, primary_cause, timestamp) VALUES (?, ?, ?, ?, ?)`,
      [zoneId, riskScore, riskLevel, primaryCause, timestamp],
      function(err) {
        if (err) {
          console.error('Failed to insert risk snapshot:', err.message);
          return reject(err);
        }
        resolve(this.lastID);
      }
    );
  });
};

const insertAlert = (zoneId, alertType, severity, message, timestamp) => {
  return new Promise((resolve, reject) => {
    db.run(
      `INSERT INTO alerts_history (zone_id, alert_type, severity, message, timestamp) VALUES (?, ?, ?, ?, ?)`,
      [zoneId, alertType, severity, message, timestamp],
      function(err) {
        if (err) {
          console.error('Failed to insert alert:', err.message);
          return reject(err);
        }
        resolve(this.lastID);
      }
    );
  });
};

const getHistoricalReadings = (zoneId, hours) => {
  return new Promise((resolve, reject) => {
    const timeLimit = new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();
    db.all(
      `SELECT pressure, flow, tank_level as tankLevel, timestamp 
       FROM sensor_readings 
       WHERE zone_id = ? AND timestamp >= ? 
       ORDER BY timestamp ASC`,
      [zoneId, timeLimit],
      (err, rows) => {
        if (err) {
          console.error('Error fetching historical readings:', err.message);
          return reject(err);
        }
        resolve(rows);
      }
    );
  });
};

const getHistoricalRisk = (zoneId, hours) => {
  return new Promise((resolve, reject) => {
    const timeLimit = new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();
    db.all(
      `SELECT risk_score as riskScore, risk_level as riskLevel, primary_cause as primaryCause, timestamp 
       FROM risk_snapshots 
       WHERE zone_id = ? AND timestamp >= ? 
       ORDER BY timestamp ASC`,
      [zoneId, timeLimit],
      (err, rows) => {
        if (err) {
          console.error('Error fetching historical risk:', err.message);
          return reject(err);
        }
        resolve(rows);
      }
    );
  });
};

const getHistoricalAlerts = (zoneId, hours) => {
  return new Promise((resolve, reject) => {
    const timeLimit = new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();
    db.all(
      `SELECT alert_type as type, severity, message, timestamp 
       FROM alerts_history 
       WHERE zone_id = ? AND timestamp >= ? 
       ORDER BY timestamp ASC`,
      [zoneId, timeLimit],
      (err, rows) => {
        if (err) {
          console.error('Error fetching historical alerts:', err.message);
          return reject(err);
        }
        resolve(rows);
      }
    );
  });
};

module.exports = {
  insertReading,
  insertRiskSnapshot,
  insertAlert,
  getHistoricalReadings,
  getHistoricalRisk,
  getHistoricalAlerts
};
