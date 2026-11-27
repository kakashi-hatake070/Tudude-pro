// Nav Bharat AI — Complete End-to-End System Verification Suite

async function runTests() {
  console.log('====================================================');
  console.log('   NAV BHARAT AI — END-TO-END VERIFICATION SUITE   ');
  console.log('====================================================\n');

  let passed = 0;
  let failed = 0;

  async function test(name, fn) {
    try {
      process.stdout.write(`Testing: ${name}... `);
      await fn();
      console.log(' PASSED');
      passed++;
    } catch (err) {
      console.log(`❌ FAILED: ${err.message}`);
      failed++;
    }
  }

  // 1. Health check of backend
  await test('1. Core API Gateway Health (/api/health)', async () => {
    const res = await fetch('http://localhost:5001/api/health');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (data.status !== 'online') throw new Error('Status not online');
  });

  // 2. Health check of AI microservice
  await test('2. AI Vision Microservice Health (FastAPI :8000)', async () => {
    const res = await fetch('http://localhost:8000/');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!data.models || data.models.length < 3) throw new Error('AI models not loaded');
  });

  // 3. AI Image classification & YOLO hazard detection endpoint
  await test('3. AI Image Classification & YOLO Hazard Scan (/ai/classify-issue)', async () => {
    const res = await fetch('http://localhost:8000/ai/classify-issue', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ hintedCategory: 'waterlogging' })
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (data.category !== 'waterlogging') throw new Error('Incorrect category');
    if (!data.severity || !data.severity.depthEstimateCm) throw new Error('Depth estimate missing');
  });

  // 4. AI Area Risk Engine calculation
  await test('4. AI Area Risk Engine (/ai/calculate-risk)', async () => {
    const res = await fetch('http://localhost:8000/ai/calculate-risk', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        rainfallMmPerHour: 28.5,
        activeHazardsCount: 5,
        waterloggingHazardsCount: 3,
        isFloodBasin: true
      })
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (data.riskScore < 60) throw new Error(`Expected high risk score, got ${data.riskScore}`);
  });

  // 5. Citizen Anonymous Registration
  let citizenToken = '';
  let citizenAnonymousId = '';
  await test('5. Anonymous Citizen Registration with Pseudonym (/api/auth/register)', async () => {
    const res = await fetch('http://localhost:5001/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: 'TestPassword123' })
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!data.user.anonymousId.includes('_')) throw new Error('Invalid anonymous pseudonym format');
    citizenToken = data.token;
    citizenAnonymousId = data.user.anonymousId;
  });

  // 6. Citizen Login
  await test('6. Citizen Login with Anonymous Identity (/api/auth/login)', async () => {
    const res = await fetch('http://localhost:5001/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ anonymousId: citizenAnonymousId, password: 'TestPassword123' })
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!data.token) throw new Error('Missing token');
  });

  // 7. Weather & Flood Inundation Layers
  await test('7. IMD Weather & Flood Polygon Layers (/api/weather/current)', async () => {
    const res = await fetch('http://localhost:5001/api/weather/current');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!data.weather || !data.floodZones || data.floodZones.length === 0) throw new Error('Flood zones missing');
  });

  // 8. Create Civic Report with Coordinates & AI Trigger
  let createdTrackingId = '';
  await test('8. Submit Civic Report with Privacy Coordinates (/api/reports)', async () => {
    const res = await fetch('http://localhost:5001/api/reports', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${citizenToken}`
      },
      body: JSON.stringify({
        category: 'waterlogging',
        title: '30cm Water Inundation Near Koramangala 80ft Road',
        description: 'Water overflowing from roadside culvert into main traffic lane.',
        longitude: 77.625,
        latitude: 12.935,
        address: '80 Feet Road, 4th Block, Koramangala',
        wardNumber: 112
      })
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!data.report.trackingId.startsWith('CS-2026-')) throw new Error('Invalid tracking ID format');
    if (!data.report.approximateLocation) throw new Error('Approximate location not generated');
    createdTrackingId = data.report.trackingId;
  });

  // 9. Upvote & Community Verification
  await test('9. Community Upvoting & Corroboration (/api/reports/:id/upvote)', async () => {
    const res = await fetch(`http://localhost:5001/api/reports/${createdTrackingId}/upvote`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${citizenToken}`
      },
      body: JSON.stringify({})
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (data.upvotes < 1) throw new Error('Upvotes not incremented');
  });

  // 10. AI Safe Route Planner with Hazard Scoring
  await test('10. AI Safe Route Planner with Hazard Scoring (/api/routing/safe-route)', async () => {
    const res = await fetch('http://localhost:5001/api/routing/safe-route', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        origin: [77.6234, 12.9175], // Silk Board
        destination: [77.6402, 12.9698], // Indiranagar
        travelMode: 'driving',
        riskPreference: 'lowest_risk'
      })
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!data.routes || data.routes.length === 0) throw new Error('No candidate routes returned');
    if (data.routes[0].riskScore === undefined) throw new Error('Route risk score missing');
  });

  // 11. Location Intelligence for Locality
  await test('11. Location Intelligence Sector Scan (/api/explore/area)', async () => {
    const res = await fetch('http://localhost:5001/api/explore/area?locality=Koramangala&lng=77.620&lat=12.935');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!data.emergencyFacilities || data.emergencyFacilities.length === 0) throw new Error('Emergency facilities missing');
    if (data.areaRiskScore === undefined) throw new Error('Area risk score missing');
  });

  // 12. Government Login
  let govToken = '';
  await test('12. Government Administration Authentication (/api/government/login)', async () => {
    const res = await fetch('http://localhost:5001/api/government/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@cityshield.gov.in', password: 'Admin@1234' })
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (data.officer.role !== 'super_admin') throw new Error('Officer role mismatch');
    govToken = data.token;
  });

  // 13. Government Dashboard Stats
  await test('13. Government KPI Dashboard Metrics (/api/government/dashboard/stats)', async () => {
    const res = await fetch('http://localhost:5001/api/government/dashboard/stats', {
      headers: { 'Authorization': `Bearer ${govToken}` }
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (data.stats.totalReports < 1) throw new Error('Total reports count invalid');
  });

  // 14. Update Status with Resolution Proof & Audit Log
  await test('14. Action Work Order & Resolution Proof (/api/government/reports/:id/status)', async () => {
    const res = await fetch(`http://localhost:5001/api/government/reports/${createdTrackingId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${govToken}`
      },
      body: JSON.stringify({
        status: 'resolved',
        remarks: 'Stormwater drain cleared and dewatering pump stationed.',
        resolutionProofUrls: ['https://images.unsplash.com/photo-1544620347-c4fd4a3d5957']
      })
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (data.report.status !== 'resolved') throw new Error('Report status not updated to resolved');
  });

  // 15. Audit Log Verification
  await test('15. Audit Trail Verification (/api/government/audit-logs)', async () => {
    const res = await fetch('http://localhost:5001/api/government/audit-logs', {
      headers: { 'Authorization': `Bearer ${govToken}` }
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!data.logs || data.logs.length === 0) throw new Error('Audit logs empty');
  });

  console.log('\n====================================================');
  console.log(`TOTAL TESTS: ${passed + failed} | PASSED: ${passed} | FAILED: ${failed}`);
  console.log('====================================================');
  if (failed > 0) process.exit(1);
}

runTests();
