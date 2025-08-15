const { expect } = require('chai');
const { p95 } = require('../helpers/util.js');
const go = require('../helpers/commonrequests.js');
const PERF_MS = process.env.PERF_MS || 1000;

// This test suite is for performance testing of the Equipment API
describe.only('Equipment API — Performance (simple p95)', function() {
  this.timeout(30000);

  async function sample(endpoint, method='get', times=5) {
    const durations = [];
    let res;
    for (let i=0; i<times; i++) {
      const start = Date.now();
      if(method === 'get') {
       res = await go.get(endpoint);
      }else if(method === 'post') {
         res = await go.create(endpoint, { name: `Test ${i}` });
      } 
      else {
        throw new Error(`Unsupported method: ${method}`);
      }
      durations.push(Date.now() - start);
      expect([200,201]).to.include(res.status);
    }
    return durations;
  }

  // Performance test for GET /api/equipment
  it(`p95 GET /api/equipment <= ${PERF_MS} ms`, async () => {
    const d = await sample('/api/equipment', 'get', 6);
    const p = p95(d);
    expect(p).to.be.at.most(Number(PERF_MS));
  });
});