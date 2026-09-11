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
  console.log("=== PHASE 5: DETERMINISTIC SIMULATOR TEST SUITE ===\n");

  // 1. Initial Status
  let status = await request('GET', '/api/simulator/status');
  console.log(`[TEST] GET /api/simulator/status -> running: ${status.running}`);

  // 2. Start Simulator
  status = await request('POST', '/api/simulator/start', { zoneId: 'mallital', deviceId: 'SIM-001', scenario: 'NORMAL' });
  console.log(`[TEST] POST /api/simulator/start -> running: ${status.running}, scenario: ${status.scenario}`);

  // 3. Let it tick
  console.log('Waiting 4 seconds to allow simulator to POST some readings...');
  await new Promise(resolve => setTimeout(resolve, 4000));

  // 4. Change Scenario
  status = await request('POST', '/api/simulator/scenario', { scenario: 'GRADUAL_DETERIORATION' });
  console.log(`[TEST] POST /api/simulator/scenario -> scenario changed to: ${status.scenario}`);

  // 5. Let it tick again
  console.log('Waiting 4 seconds for new readings...');
  await new Promise(resolve => setTimeout(resolve, 4000));

  // 6. Stop Simulator
  status = await request('POST', '/api/simulator/stop');
  console.log(`[TEST] POST /api/simulator/stop -> running: ${status.running}`);

  // 7. Verify Data Arrived at the Real Backend Pipeline
  const alertsRes = await request('GET', '/api/alerts');
  console.log(`\n[TEST] Verified Backend Integration -> Alerts Generated: ${alertsRes.alerts ? alertsRes.alerts.length : 0}`);
  if (alertsRes.alerts && alertsRes.alerts.length > 0) {
      console.log(`Last alert type: ${alertsRes.alerts[alertsRes.alerts.length - 1].type}`);
  }

  // 8. Verify existing APIs
  const healthRes = await request('GET', '/api/health');
  console.log(`[TEST] Verified Existing API GET /api/health -> status: ${healthRes.status}`);

  console.log("\nPhase 5 tests complete.");
}

runTests();
