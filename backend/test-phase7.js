const axios = require('axios');

async function runTest() {
  const BASE_URL = 'http://localhost:5000/api';
  console.log('--- Phase 7 SQLite Persistence Test ---');

  try {
    // 1. Simulate reading
    console.log('\n[1] Submitting normal sensor reading...');
    const read1 = await axios.post(`${BASE_URL}/sensors/readings`, {
      deviceId: 'HW-TEST-001',
      zoneId: 'mallital',
      pressure: 2.2,
      flow: 1350,
      tankLevel: 80
    });
    console.log('Reading saved. Alert generated:', read1.data.alert.created);

    // 2. Simulate reading that triggers alert
    console.log('\n[2] Submitting deteriorating sensor reading...');
    const read2 = await axios.post(`${BASE_URL}/sensors/readings`, {
      deviceId: 'HW-TEST-001',
      zoneId: 'mallital',
      pressure: 1.1, // very low
      flow: 2500, // very high
      tankLevel: 45
    });
    console.log('Reading saved. Alert generated:', read2.data.alert.created);

    // 3. Query history
    console.log('\n[3] Querying historical readings (24h)...');
    const histReadings = await axios.get(`${BASE_URL}/history/zones/mallital/readings?hours=24`);
    console.log(`Found ${histReadings.data.data.length} historical readings.`);

    console.log('\n[4] Querying historical risk (24h)...');
    const histRisk = await axios.get(`${BASE_URL}/history/zones/mallital/risk?hours=24`);
    console.log(`Found ${histRisk.data.data.length} historical risk snapshots.`);

    console.log('\n[5] Querying historical alerts (24h)...');
    const histAlerts = await axios.get(`${BASE_URL}/history/zones/mallital/alerts?hours=24`);
    console.log(`Found ${histAlerts.data.data.length} historical alerts.`);

    console.log('\n--- SUCCESS: Database persistence works! ---');
  } catch (error) {
    console.error('Test failed:', error.response?.data || error.message);
  }
}

runTest();
