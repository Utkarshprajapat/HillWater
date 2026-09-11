const http = require('http');

function request(method, path, body = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); } catch (e) { resolve(data); }
      });
    });

    req.on('error', reject);
    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

async function runTests() {
  console.log("=== PHASE 4: PREDICTIVE ALERTS TEST SUITE ===");

  async function postReading(pressure, flow = 80, tank = 80, timestamp = new Date().toISOString()) {
    const res = await request('POST', '/api/sensors/readings', {
      deviceId: 'HW-001',
      zoneId: 'mallital',
      pressure,
      flow,
      tankLevel: tank,
      timestamp
    });
    const lastAlertRes = await request('GET', '/api/zones/mallital/alerts');
    const alerts = lastAlertRes.alerts || [];
    const lastAlert = alerts[alerts.length - 1];
    
    console.log(`Posted P=${pressure}. Risk=${res.risk ? res.risk.score : '?'} [${res.risk ? res.risk.level : '?'}]. Alert Gen=${res.alert && res.alert.created ? res.alert.type : 'false'}`);
    return { res, lastAlert, alerts };
  }

  // TEST 1: NORMAL
  console.log("\n--- TEST 1: NORMAL ---");
  await postReading(14.0);
  await postReading(13.9);
  await postReading(14.0);

  // TEST 2: EARLY WARNING
  // Need steady deterioration but staying moderate
  console.log("\n--- TEST 2: EARLY WARNING ---");
  await postReading(13.2);
  await postReading(12.8);
  await postReading(12.4);

  // TEST 3: MODERATE -> HIGH (RISK ESCALATION)
  console.log("\n--- TEST 3: MODERATE -> HIGH (RISK ESCALATION) ---");
  await postReading(11.2); // Should drop enough to hit HIGH

  // TEST 7: NO DUPLICATES
  console.log("\n--- TEST 7: NO DUPLICATES (Repeated High) ---");
  await postReading(11.1);
  await postReading(11.1);

  // TEST 4: HIGH -> CRITICAL
  console.log("\n--- TEST 4: HIGH -> CRITICAL ---");
  await postReading(8.0); // Should hit CRITICAL

  // TEST 5: RAPID DETERIORATION
  console.log("\n--- TEST 5: RAPID DETERIORATION ---");
  await request('POST', '/api/sensors/readings', { deviceId: 'HW-002', zoneId: 'sukhatal', pressure: 13.8, flow: 80, tankLevel: 80, timestamp: new Date().toISOString() });
  await request('POST', '/api/sensors/readings', { deviceId: 'HW-002', zoneId: 'sukhatal', pressure: 13.0, flow: 80, tankLevel: 80, timestamp: new Date().toISOString() });
  await request('POST', '/api/sensors/readings', { deviceId: 'HW-002', zoneId: 'sukhatal', pressure: 12.0, flow: 80, tankLevel: 80, timestamp: new Date().toISOString() });
  const rapidRes = await request('POST', '/api/sensors/readings', { deviceId: 'HW-002', zoneId: 'sukhatal', pressure: 10.5, flow: 80, tankLevel: 80, timestamp: new Date().toISOString() });
  console.log(`Sukhatal Rapid Drop Alert: ${rapidRes.alert && rapidRes.alert.created ? rapidRes.alert.type : 'false'}`);

  // TEST 6: RECOVERY
  console.log("\n--- TEST 6: RECOVERY (Mallital) ---");
  await postReading(11.0);
  await postReading(13.8);

  // TEST 8: DATA QUALITY
  console.log("\n--- TEST 8: DATA QUALITY ---");
  const oldDate = new Date(Date.now() - 30 * 60 * 1000).toISOString();
  await postReading(13.8, 80, 80, oldDate);

  console.log("\n--- ALL ALERTS GENERATED ---");
  const allAlerts = await request('GET', '/api/alerts');
  allAlerts.alerts.forEach(a => {
    console.log(`[${a.type}] ${a.severity} | ${a.zoneId} | ${a.message}`);
  });
}

runTests();
